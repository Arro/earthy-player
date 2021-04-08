import test from "ava"
import path from "path"
import fs from "fs-extra"
import htmlToSegments from "src/html-to-segments"
import pff_vocab from "test/shared/pff-vocab"
import pff_discard from "test/shared/pff-discard"
import voices from "test/shared/voices"

test("html to segments", async (t) => {
  const html = await fs.readFile(
    path.join(__dirname, "fixtures", "002_pff.html"),
    "utf-8"
  )

  const segments = await htmlToSegments({
    html,
    first_para: "Utilizing our player props tool",
    second_para: "Written picks have also done well",
    voices,
    sound_effects_dir:
      "https://clammy-tennis.s3-ap-southeast-1.amazonaws.com/48000/",
    sound_effects: {
      start: "moldy-trace.wav",
      tweet_replacement: "moldy-prove.wav",
      unknown_replacement: "nappy-begin.wav",
      list_item_marker: "lying-match.wav"
    },
    discard_if_found: pff_discard,
    vocab: pff_vocab
  })

  let solution = await fs.readFile(
    path.join(__dirname, "fixtures", "003_segments.json"),
    "utf-8"
  )
  solution = JSON.parse(solution)

  t.deepEqual(segments, solution)
})
