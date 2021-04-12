import test from "ava"
import path from "path"
import fs from "fs-extra"
import htmlToSegments from "src/html-to-segments"
import pff_vocab from "test/shared/pff-vocab"
import pff_discard from "test/shared/pff-discard"
import voices from "test/shared/voices"
import sound_effects from "test/shared/sound-effects"

test("html to segments", async (t) => {
  const html = await fs.readFile(
    path.join(__dirname, "fixtures", "008_pff_rookie_rankings.html"),
    "utf-8"
  )
  const segments = await htmlToSegments({
    html,
    first_para: "Now that the members of the 2020 rookie",
    second_para: "There are three new entrants on this list",
    voices,
    sound_effects_dir:
      "https://clammy-tennis.s3-ap-southeast-1.amazonaws.com/mp3/",
    sound_effects,
    discard_if_found: pff_discard,
    vocab: pff_vocab
  })

  let solution = await fs.readFile(
    path.join(__dirname, "fixtures", "009_segments.json"),
    "utf-8"
  )
  solution = JSON.parse(solution)

  t.deepEqual(segments, solution)
})
