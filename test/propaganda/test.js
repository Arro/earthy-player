import test from "ava"
import path from "path"

import fs from "fs-extra"
import htmlToSegments from "src/html-to-segments"

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
  /*
  await fs.writeFile(
    path.join(__dirname, "fixtures", "segments_solution.json"),
    JSON.stringify(segments, null, 2),
    "utf-8"
  )
  t.pass()
 */
})
