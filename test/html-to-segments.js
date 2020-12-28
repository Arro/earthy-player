import test from "ava"
import path from "path"

import { promises as fsPromises } from "fs"
import htmlToSegments from "../src/html-to-segments"

test.beforeEach(async (t) => {
  t.context.voices = {
    heading: {
      type: "speech",
      voice_name: `en-GB-Wavenet-A`,
      language_code: `en-GB`,
      pitch: -2.8,
      speed: 1.15
    },
    list_item: {
      type: "speech",
      voice_name: `en-GB-Wavenet-C`,
      language_code: `en-GB`,
      pitch: -3.6,
      speed: 1.23
    },
    paragraph: {
      type: "speech",
      voice_name: `en-GB-Wavenet-B`,
      language_code: `en-GB`,
      pitch: -5,
      speed: 1
    },
    quote: {
      type: "speech",
      voice_name: `en-GB-Wavenet-D`,
      language_code: `en-GB`,
      pitch: -2,
      speed: 1
    }
  }

  t.context.selectors = {
    parent: ".m-longform-copy",
    top_level_types: [
      "p",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "blockquote",
      "div",
      "table"
    ],
    title: "meta[name='twitter:title']",
    by: "meta[name='author']",
    date: "meta[property='article:published_time']",
    date_format: "YYYY-MM-DD HH:mm:ss"
  }

  t.context.discard_if_found = [
    "Subscribe to PFF",
    "Premium Article",
    "Subscribe now",
    "Sign Up",
    "ELITE subscribers",
    "PFF's advanced statistics"
  ]

  t.context.sound_effects_dir = `https://clammy-tennis.s3-ap-southeast-1.amazonaws.com/48000/`

  t.context.sound_effects = {
    start: "moldy-trace.wav",
    tweet_replacement: "moldy-prove.wav",
    unknown_replacement: "nappy-begin.wav",
    list_item_marker: "lying-match.wav"
  }

  t.context.vocab = {
    C: "center",
    CB: "cornerback",
    DB: "defensive back",
    DE: "defensive end",
    DI: "defensive interior",
    DL: "defensive lineman",
    DT: "defensive tackle",
    EDGE: "edge rusher",
    FB: "fullback",
    FS: "free safety",
    G: "guard",
    HB: "halfback",
    K: "kicker",
    LB: "linebacker",
    LS: "long snapper",
    OT: "offensive tackle",
    OL: "offensive lineman",
    NT: "nose tackle",
    P: "punter",
    QB: "quarterback",
    RB: "running back",
    S: "safety",
    SS: "strong safety",
    T: "tackle",
    TE: "tight end",
    WR: "wide receiver",
    II: "the second",
    III: "the third"
  }
})

test("html not provided", async (t) => {
  const error = await t.throwsAsync(htmlToSegments())
  t.is(error.message, "HTML not provided")
})

test("selectors not provided", async (t) => {
  const html = await fsPromises.readFile(
    path.resolve("./test/fixtures/002_pff.html"),
    "utf-8"
  )
  const error = await t.throwsAsync(htmlToSegments({ html }))

  t.is(error.message, "Selectors not provided")
})

test("sound effects not provided", async (t) => {
  const html = await fsPromises.readFile(
    path.resolve("./test/fixtures/002_pff.html"),
    "utf-8"
  )
  const error = await t.throwsAsync(
    htmlToSegments({
      html,
      selectors: t.context.selectors
    })
  )
  t.is(error.message, "Sound effects or sound effects directory not provided")
})

test("standard call", async (t) => {
  const html = await fsPromises.readFile(
    path.resolve("./test/fixtures/002_pff.html"),
    "utf-8"
  )
  const {
    selectors,
    discard_if_found,
    voices,
    sound_effects,
    sound_effects_dir,
    vocab
  } = t.context

  const segments = await htmlToSegments({
    html,
    selectors,
    discard_if_found,
    voices,
    sound_effects,
    sound_effects_dir,
    vocab
  })

  let solution = await fsPromises.readFile(
    path.resolve(`./test/fixtures/003_segments.json`),
    "utf-8"
  )
  solution = JSON.parse(solution)

  t.deepEqual(segments, solution)
})

test("another call", async (t) => {
  const html = await fsPromises.readFile(
    path.resolve("./test/fixtures/008_pff_rookie_rankings.html"),
    "utf-8"
  )
  const {
    selectors,
    discard_if_found,
    voices,
    sound_effects,
    sound_effects_dir,
    vocab
  } = t.context

  const segments = await htmlToSegments({
    html,
    selectors,
    discard_if_found,
    voices,
    sound_effects,
    sound_effects_dir,
    vocab
  })

  let solution = await fsPromises.readFile(
    path.resolve(`./test/fixtures/009_segments.json`),
    "utf-8"
  )
  solution = JSON.parse(solution)

  t.deepEqual(segments, solution)
})

test("with a table", async (t) => {
  const html = await fsPromises.readFile(
    path.resolve("./test/fixtures/010_pff_fantasy.html"),
    "utf-8"
  )
  const {
    selectors,
    discard_if_found,
    voices,
    sound_effects,
    sound_effects_dir,
    vocab
  } = t.context

  const segments = await htmlToSegments({
    html,
    selectors,
    discard_if_found,
    voices,
    sound_effects,
    sound_effects_dir,
    vocab
  })

  let solution = await fsPromises.readFile(
    path.resolve(`./test/fixtures/011_segments.json`),
    "utf-8"
  )
  solution = JSON.parse(solution)

  t.deepEqual(segments, solution)
})

test("with a tweet", async (t) => {
  const html = await fsPromises.readFile(
    path.resolve("./test/fixtures/012_pff_early.html"),
    "utf-8"
  )
  const {
    selectors,
    discard_if_found,
    voices,
    sound_effects,
    sound_effects_dir,
    vocab
  } = t.context

  const segments = await htmlToSegments({
    html,
    selectors,
    discard_if_found,
    voices,
    sound_effects,
    sound_effects_dir,
    vocab
  })

  let solution = await fsPromises.readFile(
    path.resolve(`./test/fixtures/013_segments.json`),
    "utf-8"
  )
  solution = JSON.parse(solution)

  t.deepEqual(segments, solution)
})

test("with an ordered list", async (t) => {
  const html = await fsPromises.readFile(
    path.resolve("./test/fixtures/014_pff_herbert.html"),
    "utf-8"
  )
  const {
    selectors,
    discard_if_found,
    voices,
    sound_effects,
    sound_effects_dir,
    vocab
  } = t.context

  const segments = await htmlToSegments({
    html,
    selectors,
    discard_if_found,
    voices,
    sound_effects,
    sound_effects_dir,
    vocab
  })

  let solution = await fsPromises.readFile(
    path.resolve(`./test/fixtures/015_segments.json`),
    "utf-8"
  )
  solution = JSON.parse(solution)

  t.deepEqual(segments, solution)
})

test("more complicated quotes", async (t) => {
  const html = await fsPromises.readFile(
    path.resolve("./test/fixtures/016_pff_takeaways.html"),
    "utf-8"
  )
  const {
    selectors,
    discard_if_found,
    voices,
    sound_effects,
    sound_effects_dir,
    vocab
  } = t.context

  const segments = await htmlToSegments({
    html,
    selectors,
    discard_if_found,
    voices,
    sound_effects,
    sound_effects_dir,
    vocab
  })

  let solution = await fsPromises.readFile(
    path.resolve(`./test/fixtures/017_segments.json`),
    "utf-8"
  )
  solution = JSON.parse(solution)

  t.deepEqual(segments, solution)
})

test("vocab in headings", async (t) => {
  const html = await fsPromises.readFile(
    path.resolve("./test/fixtures/018_pff_grading.html"),
    "utf-8"
  )
  const {
    selectors,
    discard_if_found,
    voices,
    sound_effects,
    sound_effects_dir,
    vocab
  } = t.context

  const segments = await htmlToSegments({
    html,
    selectors,
    discard_if_found,
    voices,
    sound_effects,
    sound_effects_dir,
    vocab
  })

  let solution = await fsPromises.readFile(
    path.resolve(`./test/fixtures/019_segments.json`),
    "utf-8"
  )
  solution = JSON.parse(solution)

  t.deepEqual(segments, solution)
})
