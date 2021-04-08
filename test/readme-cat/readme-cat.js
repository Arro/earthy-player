import test from "ava"
import path from "path"

import fs from "fs-extra"
import htmlToSegments from "../src/html-to-segments"

test.beforeEach(async (t) => {
  t.context.selectors = {
    parent: ".js_post-content",
    top_level_types: ["p"],
    title: "meta[name='twitter:title']",
    by: "meta[name='author']",
    date: "meta[name='publish-date']"
  }
})

test("cat article", async (t) => {
  const html = await fs.readFile(
    path.resolve("./test/fixtures/021_cat.html"),
    "utf-8"
  )

  const { selectors } = t.context

  const segments = await htmlToSegments({
    html,
    selectors,
    vocab: {
      NJ: "New Jersey"
    }
  })

  /*
  await fs.writeFile(
    path.resolve(`./test/fixtures/022_segments.json`),
    JSON.stringify(segments, null, 2),
    "utf-8"
  )
  */

  let solution = await fs.readFile(
    path.resolve(`./test/fixtures/022_segments.json`),
    "utf-8"
  )
  solution = JSON.parse(solution)

  t.deepEqual(segments, solution)
})
