import test from "ava"
import fs from "fs"
import path from "path"
//import main from "../src/index.js"
import condense from "../src/condense.js"

const { readFile } = fs.promises

test("condense malazan", async (t) => {
  let segments = await readFile(
    path.resolve("./test/fixtures/000_malazan_segments.json"),
    "utf-8"
  )
  segments = JSON.parse(segments)

  const condensed = await condense({ segments })

  t.is(condensed.length, 3)
})

test("condense monocle", async (t) => {
  let segments = await readFile(
    path.resolve("./test/fixtures/001_monocle_segments.json"),
    "utf-8"
  )
  segments = JSON.parse(segments)

  const condensed = await condense({ segments, max_chars: 2000 })

  t.is(condensed.length, 2)
})
