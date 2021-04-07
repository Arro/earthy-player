import test from "ava"
import path from "path"
import { JSDOM } from "jsdom"

import fs from "fs-extra"
import readSchemaNet from "../src/cli/read-schema-net"
import getSelectorByText from "../src/cli/get-selector-by-text"
import htmlToSegments from "../src/html-to-segments"

test("schema.net reading", async (t) => {
  const html = await fs.readFile(
    path.resolve("./test/fixtures/027_panama.html"),
    "utf-8"
  )

  const document = new JSDOM(html)?.window?.document
  const schema = readSchemaNet(document)

  const schema_solution = JSON.parse(
    await fs.readFile(
      path.resolve("./test/fixtures/028_panama_schema.json"),
      "utf-8"
    )
  )

  t.deepEqual(schema, schema_solution)
})

test("get selector by text: text", async (t) => {
  const html = await fs.readFile(
    path.resolve("./test/fixtures/027_panama.html"),
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
    path.resolve("./test/fixtures/027_panama.html"),
    "utf-8"
  )

  const result = await htmlToSegments({
    html,
    selectors: {
      parent:
        "body > #icijorg > div > .main > .wrap.container > .row > .col-12 > .full-article-format > .post-body.justify-content-center.row > .post-content.col-12.col-md-10.col-lg-7"
    }
  })

  t.is(result, true)
})
