import test from "ava"
import fs from "fs-extra"
import path from "path"
import { JSDOM } from "jsdom"
import getNearestCommonAncestor from "src/get-nearest-common-ancestor"

test("get ancestor, removing extraneous class names", async (t) => {
  const html = await fs.readFile(
    path.join(__dirname, "fixtures", "main.html"),
    "utf-8"
  )
  const document = new JSDOM(html)?.window?.document
  const selector_1 = "This is the first paragraph of the first section."
  const selector_2 = "This is the second paragraph of the second section."

  const result = getNearestCommonAncestor(document, selector_1, selector_2)
  t.is(result, "body > ul > li > .a1")
})

test("get ancestor, 2", async (t) => {
  const html = await fs.readFile(
    path.join(__dirname, "fixtures", "2.html"),
    "utf-8"
  )
  const document = new JSDOM(html)?.window?.document

  const result = getNearestCommonAncestor(document, "Text 1", "Text 2")
  t.is(result, "body > .a1 > .a2")
})
