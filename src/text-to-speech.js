import child_process from "child_process"
import util from "util"

import textToSpeech from "@google-cloud/text-to-speech"
import fs from "fs-extra"
import path from "path"
import os from "os"

const exec = util.promisify(child_process.exec)

export default async function ({
  segments,
  slug,
  working_directory,
  output_directory = path.join(os.homedir(), "Downloads"),
  ffmpeg_path = "/usr/local/bin/ffmpeg"
}) {
  if (!segments) {
    throw new Error("Parameter 'segments' not provided. See README for format.")
  }
  if (!slug) {
    throw new Error(
      "Parameter 'slug' not provided. Should be a string without spaces."
    )
  }
  if (!working_directory) {
    throw new Error(
      "Parameter 'working_directory' not provided. Should be a path such as '/tmp'."
    )
  }
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    throw new Error("Can't find google credentials.  See README.")
  }

  const client = new textToSpeech.TextToSpeechClient()

  let filelist = ""

  for (const [i, segment] of segments.entries()) {
    const next_segment = segments?.[i + 1]
    if (!segment.what) {
      continue
    }
    if (segment.type === "sound_effect") {
      filelist += `file '${segment.filename}'\n`
      continue
    }

    let pause_length = "1s"
    if (
      segment.what === "quote" ||
      (next_segment?.what === "quote" && /^[a-z].*/.test(next_segment?.text))
    ) {
      pause_length = "0.2s"
    }
    let ssml = `<speak>${segment.text}<break time="${pause_length}"/></speak>`

    const [response] = await client.synthesizeSpeech({
      input: { ssml },
      voice: {
        languageCode: segment.language_code,
        name: segment.voice_name
      },
      audioConfig: {
        audioEncoding: "MP3",
        sampleRateHertz: 44100,
        speed: segment.speed,
        pitch: segment.pitch
      }
    })

    await new Promise(function (resolve) {
      setTimeout(resolve, 150)
    })

    const filename = path.resolve(`${working_directory}/${slug}-${i}.mp3`)
    await fs.writeFile(filename, response.audioContent, "binary")

    filelist += `file '${filename}'\n`
  }

  const list_filename = path.resolve(`${working_directory}/${slug}-list.txt`)
  const untracked_filename = path.resolve(`${output_directory}/${slug}.mp3`)
  await fs.writeFile(list_filename, filelist, "utf-8")

  const command = [
    ffmpeg_path,
    "-f",
    "concat",
    "-safe",
    0,
    "-i",
    list_filename,
    "-y",
    untracked_filename
  ].join(" ")
  console.log(command)

  return await exec(command)
}
