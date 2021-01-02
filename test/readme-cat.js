import test from "ava"
import path from "path"

import fs from "fs-extra"
import htmlToSegments from "../src/html-to-segments"

test.beforeEach(async (t) => {
  t.context.selectors = {
    parent: ".js_post-content",
    top_level_types: ["p"],
    title: "meta[name='twitter:title']",
    by: "meta[name='author']",
    date: "meta[name='publish-date']"
  }

  t.context.sound_effects_dir = `https://clammy-tennis.s3-ap-southeast-1.amazonaws.com/48000/`

  t.context.sound_effects = {
    start: "moldy-trace.wav",
    tweet_replacement: "moldy-prove.wav",
    unknown_replacement: "nappy-begin.wav",
    list_item_marker: "lying-match.wav"
  }
})

test("cat article", async (t) => {
  const html = await fs.readFile(
    path.resolve("./test/fixtures/021_cat.html"),
    "utf-8"
  )

  const { selectors, sound_effects, sound_effects_dir } = t.context

  const segments = await htmlToSegments({
    html,
    selectors,
    sound_effects,
    sound_effects_dir,
    vocab: {
      NJ: "New Jersey"
    }
  })

  /*
  await fs.writeFile(
    path.resolve(`./test/fixtures/022_segments.json`),
    JSON.stringify(segments, null, 2),
    "utf-8"
  )
  */

  let solution = await fs.readFile(
    path.resolve(`./test/fixtures/022_segments.json`),
    "utf-8"
  )
  solution = JSON.parse(solution)

  t.deepEqual(segments, solution)
})
