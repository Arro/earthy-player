import test from "ava"
import path from "path"

import fs from "fs-extra"
import htmlToSegments from "#src/html-to-segments.js"

test("html to segments", async (t) => {
  const html = await fs.readFile(
    path.join(__dirname, "fixtures", "source.html"),
    "utf-8"
  )

  const segments = await htmlToSegments({
    html,
    first_para: "Fifty-eight selected navigational",
    second_para: "Under optimal conditions",
    vocab: {
      "No.": "Number",
      "App.": "Apparent"
    }
  })

  const segments_solution = JSON.parse(
    await fs.readFile(
      path.join(__dirname, "fixtures", "segments_solution.json"),
      "utf-8"
    )
  )
  t.deepEqual(segments_solution, segments)
  /*
  await fs.writeFile(
    path.join(__dirname, "fixtures", "segments_solution.json"),
    JSON.stringify(segments, null, 2),
    "utf-8"
  )

  await fs.writeFile(
    path.join(__dirname, "fixtures", "segments_solution.json"),
    JSON.stringify(segments, null, 2),
    "utf-8"
  )
  t.pass()
  */
})
