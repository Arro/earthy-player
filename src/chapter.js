import { getAudioDuration } from "./get-audio-duration"
import moment from "moment"
import path from "path"

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

export default async function (segments, slug, working_directory) {
  let ms_passed = 0
  let last_chapter = 0
  let last_title = "Title"
  let description = ""
  let chapters = initMetadata(slug)

  for (const [i, segment] of segments.entries()) {
    if (segment.type === "sound_effect") {
      const duration = await getAudioDuration(segment.filename)
      console.log(`${duration / 1000} seconds`)
      ms_passed += duration
      continue
    }

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

    const filename = path.resolve(`${working_directory}/${slug}-${i}.mp3`)
    const duration = await getAudioDuration(filename)
    console.log(`${duration / 1000} seconds`)
    ms_passed += duration
  }
  chapters += addChapter(last_chapter, ms_passed, last_title)

  return {
    description,
    chapters
  }
}

/*
  const chapter_filename = path.resolve(
    `${working_directory}/${slug}-chapters.txt`
  )
  await writeFile(chapter_filename, chapters, "utf-8")

  const description_filename = path.resolve(
    `${working_directory}/${slug}-description.txt`
  )
  await writeFile(description_filename, description, "utf-8")
*/

/*
  //const output_filename = path.resolve(`${working_directory}/${slug}.mp3`)
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
*/
