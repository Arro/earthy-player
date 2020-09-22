import test from "ava"
import path from "path"
import os from "os"

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

test("selectors not provided", async (t) => {
  const error = await t.throwsAsync(
    htmlToSegments({ html: t.context.pff_html })
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
  const segments = await htmlToSegments({
    html: t.context.pff_html,
    selectors: {
      parent: ".m-longform-copy",
      top_level_types: [
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
      ],
      title: "meta[name='twitter:title']",
      by: "meta[name='author']",
      date: "meta[property='article:published_time']",
      date_format: "YYYY-MM-DD HH:mm:ss"
    },
    sound_effects_dir: `${os.homedir()}/Dropbox/Audio/Sounds`,
    sound_effects: {
      start: "moldy-trace-48000.wav",
      tweet_replacement: "moldy-prove-48000.wav",
      unknown_replacement: "nappy-begin-48000.wav"
    },
    discard_if_found: [
      "Subscribe to PFF",
      "Premium Article",
      "Subscribe now",
      "Sign Up"
    ],
    voices: {
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
  })

  await fsPromises.writeFile(
    path.resolve(`${os.homedir()}/Downloads/segments.json`),
    JSON.stringify(segments, null, 2),
    "utf-8"
  )

  //console.log(segments)

  t.pass()
})
