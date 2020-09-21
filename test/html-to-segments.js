import test from "ava"
import path from "path"
import { promises as fsPromises } from "fs"
import htmlToSegments from "../src/html-to-segments"

test.beforeEach(async (t) => {
  t.context.pff_html = await fsPromises.readFile(
    path.resolve("./test/fixtures/002_pff.html"),
    "utf-8"
  )
})

test("html not provided", async (t) => {
  const error = await t.throwsAsync(htmlToSegments())
  t.is(error.message, "HTML not provided")
})

test("types not provided", async (t) => {
  const error = await t.throwsAsync(
    htmlToSegments({ html: t.context.pff_html })
  )

  t.is(error.message, "Top level types not provided")
})

test("selectors not provided", async (t) => {
  const error = await t.throwsAsync(
    htmlToSegments({ html: t.context.pff_html, top_level_types: ["p"] })
  )

  t.is(error.message, "Selectors not provided")
})

test("sound effects not provided", async (t) => {
  const error = await t.throwsAsync(
    htmlToSegments({
      html: t.context.pff_html,
      top_level_types: ["p"],
      selectors: {}
    })
  )
  t.is(error.message, "Sound effects or sound effects directory not provided")
})

test("standard call", async (t) => {
  const top_level_types = [
    "p",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ul>li",
    "blockquote",
    "div"
  ]

  const segments = await htmlToSegments({
    html: t.context.pff_html,
    top_level_types,
    selectors: {
      parent: ".m-longform-copy",
      title: ".g-h1",
      by: ".m-micro-copy",
      date: ".m-micro-copy",
      date_format: "MMM D, YYYY"
    },
    sound_effects_dir: "~/Dropbox/Audio/Sounds",
    sound_effects: {
      start: "moldy-trace-48000.wav",
      tweet_replacement: "moldy-prove-48000.wav",
      unknown_replacement: "nappy-begin-48000.wav"
    }
  })

  console.log(segments)

  t.pass()
})
