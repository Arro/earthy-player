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
    path.join(__dirname, "fixtures", "002_pff.html"),
    "utf-8"
  )

  const segments = await htmlToSegments({
    html,
    first_para: "Utilizing our player props tool",
    second_para: "Written picks have also done well",
    voices,
    sound_effects_dir:
      "https://clammy-tennis.s3-ap-southeast-1.amazonaws.com/mp3/",
    sound_effects,
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

test("html to segments, paragraphs not provided", async (t) => {
  const html = await fs.readFile(
    path.join(__dirname, "fixtures", "002_pff.html"),
    "utf-8"
  )
  const error = await t.throwsAsync(htmlToSegments({ html }))

  t.is(error.message, "Paragraphs not provided")
})
