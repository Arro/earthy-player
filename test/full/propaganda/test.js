import test from "ava"
import path from "path"

import fs from "fs-extra"
import htmlToSegments from "#src/html-to-segments.js"

test("html to segments", async (t) => {
  const html = await fs.readFile(
    path.join(__dirname, "fixtures", "propaganda.html"),
    "utf-8"
  )

  const segments = await htmlToSegments({
    html,
    first_para: "which is currently streaming",
    second_para: "The conceit of the show"
  })

  const segments_solution = JSON.parse(
    await fs.readFile(
      path.join(__dirname, "fixtures", "segments_solution.json"),
      "utf-8"
    )
  )

  t.deepEqual(segments, segments_solution)
})
