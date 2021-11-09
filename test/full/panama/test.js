import test from "ava"
import path from "path"
import { JSDOM } from "jsdom"

import fs from "fs-extra"
import getMetadata from "#src/get-metadata.js"
import getSelectorByText from "#src/get-selector-by-text.js"
import htmlToSegments from "#src/html-to-segments.js"

test("get metadata", async (t) => {
  const html = await fs.readFile(
    path.join(__dirname, "fixtures", "027_panama.html"),
    "utf-8"
  )

  const document = new JSDOM(html)?.window?.document
  const schema = getMetadata(document)

  const schema_solution = JSON.parse(
    await fs.readFile(
      path.join(__dirname, "fixtures", "028_panama_schema.json"),
      "utf-8"
    )
  )

  t.deepEqual(schema, schema_solution)
})

test("get metadata with force_no_schema on", async (t) => {
  const html = await fs.readFile(
    path.join(__dirname, "fixtures", "027_panama.html"),
    "utf-8"
  )

  const document = new JSDOM(html)?.window?.document
  const schema = getMetadata(document, true)

  let meta_solution = JSON.parse(
    await fs.readFile(
      path.join(__dirname, "fixtures", "030_panama_meta.json"),
      "utf-8"
    )
  )
  meta_solution.author = undefined // workaround

  t.deepEqual(schema, meta_solution)
})

test("get selector by text: text", async (t) => {
  const html = await fs.readFile(
    path.join(__dirname, "fixtures", "027_panama.html"),
    "utf-8"
  )

  const document = new JSDOM(html)?.window?.document

  const result = getSelectorByText(
    document,
    "more than 100 media partners around the globe"
  )
  t.is(
    result,
    "body > #icijorg > div > .main > .wrap.container > .row > .col-12 > .full-article-format > .post-body.justify-content-center.row > .post-content.col-12.col-md-10.col-lg-7"
  )
})

test("html to segments", async (t) => {
  const html = await fs.readFile(
    path.join(__dirname, "fixtures", "027_panama.html"),
    "utf-8"
  )

  const result = await htmlToSegments({
    html,
    first_para: "the International Consortium of Investigative Journalists",
    second_para: "Citizens hit the streets in protest"
  })

  const solution = JSON.parse(
    await fs.readFile(
      path.join(__dirname, "fixtures", "029_panama_segments.json"),
      "utf-8"
    )
  )

  t.deepEqual(result, solution)
})
