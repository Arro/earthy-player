import test from "ava"
import path from "path"
import fs from "fs-extra"
import htmlToSegments from "src/html-to-segments"

test("html to segments", async (t) => {
  const html = await fs.readFile(
    path.join(__dirname, "fixtures", "032_weddings.html"),
    "utf-8"
  )
  const segments = await htmlToSegments({
    html,
    first_para: "a photograph of the breakfast",
    second_para: "back when people canceled weddings"
  })

  let solution = await fs.readFile(
    path.join(__dirname, "fixtures", "segments.json"),
    "utf-8"
  )
  solution = JSON.parse(solution)

  t.deepEqual(solution, segments)
})
