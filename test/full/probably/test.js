import test from "ava"
import path from "path"
import fs from "fs-extra"
import htmlToSegments from "#src/html-to-segments.js"

test("html to segments", async (t) => {
  const html = await fs.readFile(
    path.join(__dirname, "fixtures", "031_probably.html"),
    "utf-8"
  )
  const segments = await htmlToSegments({
    html,
    first_para: "most perplexing and enduring mysteries",
    second_para: "The mystery is hardly unique"
  })

  let solution = await fs.readFile(
    path.join(__dirname, "fixtures", "segments.json"),
    "utf-8"
  )
  solution = JSON.parse(solution)

  t.deepEqual(solution, segments)
})
