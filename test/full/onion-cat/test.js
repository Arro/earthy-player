import test from "ava"
import path from "path"

import fs from "fs-extra"
import htmlToSegments from "#src/html-to-segments.js"

test("cat article", async (t) => {
  const html = await fs.readFile(
    path.join(__dirname, "fixtures", "021_cat.html"),
    "utf-8"
  )

  const segments = await htmlToSegments({
    html,
    first_para: "Twenty-eight-year-old Jason Wagner",
    second_para: "For 15 minutes he was purring",
    no_desc: true,
    vocab: {
      NJ: "New Jersey"
    }
  })

  let solution = await fs.readFile(
    path.join(__dirname, "fixtures", "022_segments.json"),
    "utf-8"
  )
  solution = JSON.parse(solution)

  t.deepEqual(segments, solution)
})
