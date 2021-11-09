import test from "ava"
import path from "path"
import { JSDOM } from "jsdom"

import fs from "fs-extra"
import getSelectorByText from "#src/get-selector-by-text.js"
import getMetadata from "#src/get-metadata.js"

test("get selector by text: author", async (t) => {
  const html = await fs.readFile(
    path.join(__dirname, "fixtures", "023_island.html"),
    "utf-8"
  )

  const document = new JSDOM(html)?.window?.document

  const result = getSelectorByText(document, "Julian")
  t.is(
    result,
    "body > #__next > .container > .main-content > div > .observer > .observer__content > .article > .article__longform__masthead > .article__header > .article__header__dek-contributions > .contributors > .contributor > .contributor__meta > div > a"
  )
})

test("get selector by text: date", async (t) => {
  const html = await fs.readFile(
    path.join(__dirname, "fixtures", "023_island.html"),
    "utf-8"
  )

  const document = new JSDOM(html)?.window?.document

  const result = getSelectorByText(document, "30.3.21")

  t.is(
    result,
    "body > #__next > .container > .main-content > div > .observer > .observer__content > .article > .article__longform__masthead > .article__header > .article__header__dek-contributions > .article__header__datebar > .article__header__datebar__date--original"
  )
})

test("get metadata", async (t) => {
  const html = await fs.readFile(
    path.join(__dirname, "fixtures", "023_island.html"),
    "utf-8"
  )

  const document = new JSDOM(html)?.window?.document
  const schema = getMetadata(document)

  const schema_solution = JSON.parse(
    await fs.readFile(
      path.join(__dirname, "fixtures", "024_island_schema.json"),
      "utf-8"
    )
  )

  t.deepEqual(schema, schema_solution)
})

test("get selector by text: text", async (t) => {
  const html = await fs.readFile(
    path.join(__dirname, "fixtures", "023_island.html"),
    "utf-8"
  )

  const document = new JSDOM(html)?.window?.document

  const result = getSelectorByText(document, "In 1966, a group of six")
  t.is(
    result,
    "body > #__next > .container > .main-content > div > .observer > .observer__content > .article > .article__longform__content > .article__body-components.article__body-components--longform > .long-form__body-group > .abc__textblock.size--article"
  )
})
