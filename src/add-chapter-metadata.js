import { getAudioDuration } from "./get-audio-duration"
import { spawn } from "promisify-child-process"
import moment from "moment"
import path from "path"
import { promises as fsPromises } from "fs"

export default async function ({
  segments,
  slug,
  working_directory,
  artist = "earthy-player"
}) {
  let chapters = []

  let start = 0
  let end = 0
  for (const [i, segment] of segments.entries()) {
    let { what, text, filename } = segment
    if (!filename)
      filename = path.resolve(`${working_directory}/${slug}-${i}.mp3`)
    if (what === "title") {
      chapters.push({ text, start, end })
      end = start = end + 1
    } else {
      end += await getAudioDuration(filename)
    }
  }

  const description = chapters
    .map((c) => {
      const duration = moment.duration(c.start, "ms")
      let hours = `${duration.hours() < 10 ? "0" : ""}${duration.hours()}`
      let minutes = `${duration.minutes() < 10 ? "0" : ""}${duration.minutes()}`
      let seconds = `${duration.seconds() < 10 ? "0" : ""}${duration.seconds()}`

      return `${hours}:${minutes}:${seconds} -- ${c.title}`
    })
    .join("\n\n")

  let raw_chapters = chapters.map(({ start, end, title }) => {
    return `[CHAPTER]\nTIMEBASE=1/1000\nSTART=${start}\nEND=${end}\ntitle=${title}`
  })
  raw_chapters = [
    `;FFMETADATA1\ntitle=${slug}\nartist=${artist}`,
    ...chapters
  ].join("\n")

  const chapter_filename = path.resolve(
    `${working_directory}/${slug}-chapters.txt`
  )
  await fsPromises.writeFile(chapter_filename, raw_chapters, "utf-8")

  const description_filename = path.resolve(
    `${working_directory}/${slug}-description.txt`
  )
  await fsPromises.writeFile(description_filename, description, "utf-8")
  const untracked_filename = path.resolve(
    `${working_directory}/${slug}-untracked.mp3`
  )
  const output_filename = path.resolve(`${working_directory}/${slug}.mp3`)
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

  return chapters
}
