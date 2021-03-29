import test from "ava"
import fs from "fs"
import path from "path"

import condenseSegments from "../src/condense-segments.js"
import textToSpeech from "../src/text-to-speech.js"

const { readFile } = fs.promises

test("condense malazan", async (t) => {
  let segments = await readFile(
    path.resolve("./test/fixtures/000_malazan_segments.json"),
    "utf-8"
  )
  segments = JSON.parse(segments)

  const condensed = await condenseSegments({ segments })

  t.is(condensed.length, 3)
})

test("condense monocle", async (t) => {
  let segments = await readFile(
    path.resolve("./test/fixtures/001_monocle_segments.json"),
    "utf-8"
  )
  segments = JSON.parse(segments)

  const condensed = await condenseSegments({ segments, max_chars: 2000 })

  t.is(condensed.length, 2)
})

test("main function no slug", async (t) => {
  const segments = [
    {
      text: "Blah Blah Blah",
      what: "paragraph",
      type: "speech",
      voice_name: "en-US-Wavenet-C",
      language_code: "en-US",
      pitch: -2.0,
      speed: 1
    }
  ]

  const error = await t.throwsAsync(textToSpeech({ segments }))
  t.is(
    error.message,
    "Parameter 'slug' not provided. Should be a string without spaces."
  )
})

test("main function no dir ", async (t) => {
  const segments = [
    {
      text: "Blah Blah Blah",
      what: "paragraph",
      type: "speech",
      voice_name: "en-US-Wavenet-C",
      language_code: "en-US",
      pitch: -2.0,
      speed: 1
    }
  ]

  const slug = "testing-123"

  const error = await t.throwsAsync(textToSpeech({ segments, slug }))
  t.is(
    error.message,
    "Parameter 'working_directory' not provided. Should be a path such as '/tmp'."
  )
})
