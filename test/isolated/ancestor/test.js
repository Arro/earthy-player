import test from "ava"
import fs from "fs-extra"
import path from "path"
import { JSDOM } from "jsdom"
import getNearestCommonAncestor from "src/get-nearest-common-ancestor"

test("get nearest common ancestor", async (t) => {
  const html = await fs.readFile(
    path.join(__dirname, "fixtures", "main.html"),
    "utf-8"
  )
  const document = new JSDOM(html)?.window?.document
  const selector_1 = "As a fast-paced growth company"
  const selector_2 = "Use your deep understanding of the JavaScript ecosystem"

  getNearestCommonAncestor(document, selector_1, selector_2)
  t.pass()
})
