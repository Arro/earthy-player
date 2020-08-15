const textToSpeech = require("@google-cloud/text-to-speech")
const { writeFile } = require("fs").promises
import moment from "moment"

import { getAudioDuration } from "./get-audio-duration"
import { spawn } from "promisify-child-process"

function initMetadata(slug, artist) {
  return `;FFMETADATA1
title=${slug}
artist=${artist}
  `
}

function addChapter(start, end, title) {
  return `
[CHAPTER]
TIMEBASE=1/1000
START=${start}
END=${end}
title=${title}
`
}

export async function handleSegments(slug, segments) {
  const client = new textToSpeech.TextToSpeechClient()

  let ms_passed = 0
  let last_chapter = 0
  let last_title = "Title"
  let description = ""
  let filelist = ""
  let chapters = initMetadata(slug)

  for (const [i, segment] of segments.entries()) {
    console.log(`\n\n----${i}`)
    if (segment.type === "sound_effect") {
      filelist += `file '${segment.filename}'\n`

      const duration = await getAudioDuration(segment.filename)
      console.log(`${duration / 1000} seconds`)
      ms_passed += duration

      continue
    }

    // Construct the request
    const request = {
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
    }

    const [response] = await client.synthesizeSpeech(request)
    const filename = `/tmp/${slug}-${i}.mp3`
    await writeFile(filename, response.audioContent, "binary")

    if (segment.what === "title") {
      if (ms_passed - last_chapter > 0) {
        chapters += addChapter(last_chapter, ms_passed, last_title)
        description += `${moment.duration(ms_passed, "ms").minutes} minutes, ${
          moment.duration(ms_passed, "ms").seconds
        } seconds -- ${last_title}\n\n`
      }

      last_title = segment.text
      last_chapter = ms_passed
    }

    const duration = await getAudioDuration(filename)
    console.log(`${duration / 1000} seconds`)
    ms_passed += duration

    filelist += `file '${filename}'\n`
  }
  chapters += addChapter(last_chapter, ms_passed, last_title)
  const chapter_filename = `/tmp/${slug}-chapters.txt`
  await writeFile(chapter_filename, chapters, "utf-8")

  const list_filename = `/tmp/${slug}-list.txt`
  const untracked_filename = `/tmp/${slug}-untracked.mp3`
  const output_filename = `/tmp/${slug}.mp3`
  const description_filename = `/tmp/${slug}-description.txt`
  await writeFile(list_filename, filelist, "utf-8")
  await writeFile(description_filename, description, "utf-8")

  await spawn(
    `/usr/local/bin/ffmpeg`,
    ["-f", "concat", "-safe", 0, "-i", list_filename, "-y", untracked_filename],
    { encoding: "utf-8", maxBuffer: 200 * 1024 }
  )

  await spawn(
    `/usr/local/bin/ffmpeg`,
    [
      "-i",
      untracked_filename,
      "-i",
      chapter_filename,
      "-map_metadata",
      "1",
      "-codec",
      "copy",
      "-y",
      output_filename
    ],
    { encoding: "utf-8", maxBuffer: 200 * 1024 }
  )
}

export function condenseSegments(speech_segments) {
  // condense now
  let condensed = []

  for (const segment of speech_segments) {
    let prev_segment = condensed?.[condensed.length - 1]
    if (
      segment.type === "speech" &&
      prev_segment?.type === "speech" &&
      prev_segment?.what === segment.what &&
      prev_segment?.voice_name === segment.voice_name &&
      prev_segment?.text?.length + segment.text.length < 4000
    ) {
      condensed[
        condensed.length - 1
      ].text = `${prev_segment.text}<break time="1s"/>${segment.text}`
    } else {
      condensed.push(segment)
    }
  }

  return condensed
}
