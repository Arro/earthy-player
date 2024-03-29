import test from "ava"
import path from "path"
import { JSDOM } from "jsdom"

import fs from "fs-extra"
import getMetadata from "#src/get-metadata.js"

test("get metadata", async (t) => {
  const html = await fs.readFile(
    path.join(__dirname, "fixtures", "025_wrongest.html"),
    "utf-8"
  )

  const document = new JSDOM(html)?.window?.document
  const schema = getMetadata(document)

  const schema_solution = JSON.parse(
    await fs.readFile(
      path.join(__dirname, "fixtures", "026_wrongest_schema.json"),
      "utf-8"
    )
  )

  t.deepEqual(schema, schema_solution)
})
