import test from "ava"
import path from "path"

import fs from "fs-extra"
import htmlToSegments from "#src/html-to-segments.js"

test("html to segments", async (t) => {
  const html = await fs.readFile(
    path.join(__dirname, "fixtures", "article.html"),
    "utf-8"
  )

  const segments = await htmlToSegments({
    html,
    first_para: "cans and the liquid inside them are manufactured",
    second_para: "They don’t care whether or not a"
  })

  const segments_solution = JSON.parse(
    await fs.readFile(
      path.join(__dirname, "fixtures", "segments_solution.json"),
      "utf-8"
    )
  )
  t.deepEqual(segments, segments_solution)
})
