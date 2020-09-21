import test from "ava"
import path from "path"
import { promises as fsPromises } from "fs"
import htmlToSegments from "../src/html-to-segments"

test("nothing provided", async (t) => {
  const error = await t.throwsAsync(htmlToSegments())
  t.is(error.message, "HTML not provided")
})

test("just html provided", async (t) => {
  const pff_html = await fsPromises.readFile(
    path.resolve("./test/fixtures/002_pff.html"),
    "utf-8"
  )

  const error = await t.throwsAsync(htmlToSegments({ html: pff_html }))

  t.is(error.message, "Top level types not provided")
})

test("just html and types provided", async (t) => {
  const pff_html = await fsPromises.readFile(
    path.resolve("./test/fixtures/002_pff.html"),
    "utf-8"
  )

  const error = await t.throwsAsync(
    htmlToSegments({ html: pff_html, top_level_types: ["p"] })
  )

  t.is(error.message, "Parent selector not provided")
})
