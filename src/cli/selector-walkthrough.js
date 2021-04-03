import { terminal as term } from "terminal-kit"
import paginatedMenu from "./paginated-menu.js"
import getAllMetas from "./get-all-metas.js"
import getSelectorByText from "./get-selector-by-text.js"
import { JSDOM } from "jsdom"

export default async function (html) {
  const document = new JSDOM(html)?.window?.document

  const metas = getAllMetas(document)

  term("\n")
  await term(`Which one of these is the best title?`)
  term("\n")

  const title_choice = await paginatedMenu(metas, (m) => m.content)
  const title_selector = title_choice.prop
    ? `meta[prop=${title_choice.prop}]`
    : `meta[name=${title_choice.name}]`

  term("\n")
  await term(`Which one of these is the best description?`)
  term("\n")

  const desc_choice = await paginatedMenu(metas, (m) => m.content)
  const desc_selector = desc_choice.prop
    ? `meta[prop=${desc_choice.prop}]`
    : `meta[name=${desc_choice.name}]`

  term("\n")
  await term(`Copy and paste the author's name as you see in on the website:`)
  term("\n")

  const author_name = await term.inputField().promise
  term("\n")

  const author_selector = getSelectorByText(document, author_name)

  console.log(title_selector)
  console.log(author_selector)
  console.log(desc_selector)

  /* 
  let publish_date = metas.find((m) => {
    return m.name === "publish_date"
  })
  if (!publish_date) { }
  */
  term("\n")
  await term(`Copy and paste the article date as you see in on the website:`)
  term("\n")
  const date_string = await term.inputField().promise
  const date_selector = getSelectorByText(document, date_string)
  console.log(date_selector)

  return
}
