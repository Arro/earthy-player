import test from "ava"
import path from "path"

import { promises as fsPromises } from "fs"
import addChapterMetadata from "../src/add-chapter-metadata"

test("add chapter metadata", async (t) => {
  let segments = await fsPromises.readFile(
    path.resolve(`./test/fixtures/020_segments.json`),
    "utf-8"
  )
  segments = JSON.parse(segments)

  const chapters = await addChapterMetadata({
    segments,
    slug: "test-run",
    working_directory: "/tmp/"
  })

  let solution = await fsPromises.readFile(
    path.resolve(`./test/fixtures/021_chapters_solution.json`),
    "utf-8"
  )
  solution = JSON.parse(solution)

  t.deepEqual(chapters, solution)
})
