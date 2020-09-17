import textToSpeech from "@google-cloud/text-to-speech"
import fs from "fs"
import path from "path"
import { spawn } from "promisify-child-process"

const { writeFile } = fs.promises

export default async function ({ segments, slug, working_directory }) {
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
    if (segment.type === "sound_effect") {
      filelist += `file '${segment.filename}'\n`
      continue
    }

    const [response] = await client.synthesizeSpeech({
      input: { ssml: `<speak>${segment.text}<break time="1s"/></speak>` },
      voice: {
        languageCode: segment.language_code,
        name: segment.voice_name
      },
      audioConfig: {
        audioEncoding: "MP3",
        speed: segment.speed,
        pitch: segment.pitch
      }
    })

    const filename = path.resolve(`${working_directory}/${slug}-${i}.mp3`)
    await writeFile(filename, response.audioContent, "binary")

    const wav_filename = path.resolve(`${working_directory}/${slug}-${i}.wav`)
    await spawn(
      `/usr/local/bin/ffmpeg`,
      [
        "-i",
        filename,
        "-vn",
        "-acodec",
        "pcm_s16le",
        "-ar",
        "48000",
        "-y",
        "-ac",
        "2",
        "-strict",
        "-2",
        wav_filename
      ],
      { encoding: "utf-8", maxBuffer: 200 * 1024 }
    )

    filelist += `file '${wav_filename}'\n`
  }

  const list_filename = path.resolve(`${working_directory}/${slug}-list.txt`)
  const untracked_filename = path.resolve(
    `${working_directory}/${slug}-untracked.mp3`
  )
  await writeFile(list_filename, filelist, "utf-8")

  await spawn(
    `/usr/local/bin/ffmpeg`,
    ["-f", "concat", "-safe", 0, "-i", list_filename, "-y", untracked_filename],
    { encoding: "utf-8", maxBuffer: 1000 * 1024 }
  )
}
