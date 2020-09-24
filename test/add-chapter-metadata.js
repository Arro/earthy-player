import test from "ava"
import path from "path"
import os from "os"

import { promises as fsPromises } from "fs"
import addChapterMetadata from "../src/add-chapter-metadata"

test("add chapter metadata", async (t) => {
  let segments = await fsPromises.readFile(
    path.resolve(
      `${os.homedir()}/Downloads/nimble-family/test-run-segments.json`
    ),
    "utf-8"
  )
  segments = JSON.parse(segments)

  await addChapterMetadata({
    segments,
    slug: "test-run",
    working_directory: "/tmp/"
  })

  t.pass()
})
