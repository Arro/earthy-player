import { terminal as term } from "terminal-kit"
import paginatedMenu from "./paginated-menu.js"
import getAllMetas from "./get-all-metas.js"
import getSelectorByText from "./get-selector-by-text.js"
import readSchemaNet from "./read-schema-net.js"
import { JSDOM } from "jsdom"

export default async function (html) {
  const document = new JSDOM(html)?.window?.document

  const schema = readSchemaNet(document)
  const metas = getAllMetas(document)
  console.log(schema)

  let title_selector, desc_selector, author_selector, date_selector

  if (schema?.headline) {
    title_selector = "schema.headline"
  } else {
    term("\n")
    await term(`Which one of these is the best title?`)
    term("\n")

    const title_choice = await paginatedMenu(metas, (m) => m.content)
    title_selector = title_choice.prop
      ? `meta[prop=${title_choice.prop}]`
      : `meta[name=${title_choice.name}]`
  }

  if (schema?.description) {
    desc_selector = "schema.description"
  } else {
    term("\n")
    await term(`Which one of these is the best description?`)
    term("\n")

    const desc_choice = await paginatedMenu(metas, (m) => m.content)
    desc_selector = desc_choice.prop
      ? `meta[prop=${desc_choice.prop}]`
      : `meta[name=${desc_choice.name}]`
  }

  if (schema?.author?.name) {
    author_selector = "schema.author.name"
  } else {
    term("\n")
    await term(`Copy and paste the author's name as you see in on the website:`)
    term("\n")

    const author_name = await term.inputField().promise
    term("\n")

    author_selector = getSelectorByText(document, author_name)
  }

  if (schema?.datePublished) {
    date_selector = "schema.datePublished"
  } else {
    term("\n")
    await term(`Copy and paste the article date as you see in on the website:`)
    term("\n")
    const date_string = await term.inputField().promise
    date_selector = getSelectorByText(document, date_string)
  }

  console.log(title_selector)
  console.log(author_selector)
  console.log(desc_selector)
  console.log(date_selector)
  return
}
