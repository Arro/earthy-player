import test from "ava"
import path from "path"
import fs from "fs-extra"
import htmlToSegments from "#src/html-to-segments.js"
import pff_vocab from "#test/shared/pff-vocab.js"
import pff_discard from "#test/shared/pff-discard.js"
import voices from "#test/shared/voices.js"
import sound_effects from "#test/shared/sound-effects.js"

test("html to segments", async (t) => {
  const html = await fs.readFile(
    path.join(__dirname, "fixtures", "010_pff_fantasy.html"),
    "utf-8"
  )
  const segments = await htmlToSegments({
    html,
    first_para: "Monday night's game between",
    second_para: "In a week that was",
    voices,
    sound_effects_dir:
      "https://clammy-tennis.s3-ap-southeast-1.amazonaws.com/mp3/",
    sound_effects,
    discard_if_found: pff_discard,
    vocab: pff_vocab
  })

  let solution = await fs.readFile(
    path.join(__dirname, "fixtures", "011_segments.json"),
    "utf-8"
  )
  solution = JSON.parse(solution)

  t.deepEqual(segments, solution)
})
