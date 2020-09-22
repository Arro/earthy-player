import test from "ava"
import os from "os"
import path from "path"
import { JSDOM } from "jsdom"

import { promises as fsPromises } from "fs"
import processElement from "../src/process-element"

test.beforeEach(async (t) => {
  t.context.discard_if_found = [
    "Subscribe to PFF",
    "Premium Article",
    "Subscribe now",
    "Sign Up"
  ]

  t.context.sound_effects = {
    start: "moldy-trace-48000.wav",
    tweet_replacement: "moldy-prove-48000.wav",
    unknown_replacement: "nappy-begin-48000.wav"
  }

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
})

test("blockquote", async (t) => {
  const { discard_if_found, sound_effects, voices } = t.context

  let html = await fsPromises.readFile(
    path.resolve("./test/fixtures/004_pff_blockquote.html"),
    "utf-8"
  )

  html = new JSDOM(html)
  html = html.window.document.querySelector("blockquote").textContent

  const pElements = await processElement({
    text: html.trim(),
    type: "blockquote",
    discard_if_found,
    sound_effects,
    voices
  })

  await fsPromises.writeFile(
    path.resolve(`${os.homedir()}/Downloads/005_pff_blockquote_segments.json`),
    JSON.stringify(pElements, null, 2),
    "utf-8"
  )

  let solution = await fsPromises.readFile(
    path.resolve("./test/fixtures/005_pff_blockquote_segments.json"),
    "utf-8"
  )
  solution = JSON.parse(solution)

  t.deepEqual(pElements, solution)
})

test("blockquote multi", async (t) => {
  const { discard_if_found, sound_effects, voices } = t.context

  let html = await fsPromises.readFile(
    path.resolve("./test/fixtures/006_multi_quote.html"),
    "utf-8"
  )

  html = new JSDOM(html)
  html = html.window.document.querySelector("blockquote").textContent

  const pElements = await processElement({
    text: html.trim(),
    type: "blockquote",
    discard_if_found,
    sound_effects,
    voices
  })

  await fsPromises.writeFile(
    path.resolve(`${os.homedir()}/Downloads/007_multi_quote_segments.json`),
    JSON.stringify(pElements, null, 2),
    "utf-8"
  )

  let solution = await fsPromises.readFile(
    path.resolve("./test/fixtures/007_multi_quote_segments.json"),
    "utf-8"
  )
  solution = JSON.parse(solution)

  t.deepEqual(pElements, solution)
})
