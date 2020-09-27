import { getAudioDuration } from "./get-audio-duration"
import { spawn } from "promisify-child-process"
import moment from "moment"
import path from "path"
import { promises as fsPromises } from "fs"
import { curry } from "lodash"

export default async function ({
  segments,
  slug,
  working_directory,
  ffmpeg_path = "/usr/local/bin/ffmpeg",
  ffprobe_path = "/usr/local/bin/ffprobe",
  artist = "earthy-player"
}) {
  let ms_passed = 0
  //let chapters = [initMetadata(slug)]
  let chapters = []
  let passed_here_once = false

  let addChapter = (title, start, end) => {
    chapters.push({ title, start, end })
  }
  let curried = curry(addChapter)

  for (const [i, segment] of segments.entries()) {
    if (segment.type === "sound_effect") {
      const duration = await getAudioDuration({
        filename: segment.filename,
        ffprobe_path
      })
      ms_passed += duration
      continue
    }

    if (segment.what === "title") {
      if (passed_here_once) {
        curried(ms_passed)
        curried = curry(addChapter)
      }
      curried = curried(segment.text)(ms_passed)
      passed_here_once = true
    }

    const filename = path.resolve(`${working_directory}/${slug}-${i}.mp3`)
    const duration = await getAudioDuration({
      filename,
      ffprobe_path
    })
    ms_passed += duration
  }
  curried(ms_passed)

  const description = chapters
    .map((c) => {
      const duration = moment.duration(c.start, "ms")
      let hours = `${duration.hours() < 10 ? "0" : ""}${duration.hours()}`
      let minutes = `${duration.minutes() < 10 ? "0" : ""}${duration.minutes()}`
      let seconds = `${duration.seconds() < 10 ? "0" : ""}${duration.seconds()}`

      return `${hours}:${minutes}:${seconds} -- ${c.title}`
    })
    .join("\n\n")

  chapters = chapters.map(({ start, end, title }) => {
    return `[CHAPTER]\nTIMEBASE=1/1000\nSTART=${start}\nEND=${end}\ntitle=${title}`
  })
  chapters = [
    `;FFMETADATA1\ntitle=${slug}\nartist=${artist}`,
    ...chapters
  ].join("\n")

  const chapter_filename = path.resolve(
    `${working_directory}/${slug}-chapters.txt`
  )
  await fsPromises.writeFile(chapter_filename, chapters, "utf-8")

  const description_filename = path.resolve(
    `${working_directory}/${slug}-description.txt`
  )
  await fsPromises.writeFile(description_filename, description, "utf-8")
  const untracked_filename = path.resolve(
    `${working_directory}/${slug}-untracked.mp3`
  )
  const output_filename = path.resolve(`${working_directory}/${slug}.mp3`)
  await spawn(
    ffmpeg_path,
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
