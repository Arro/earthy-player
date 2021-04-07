import { terminal as term } from "terminal-kit"
// import paginatedMenu from "./paginated-menu.js"
import getAllMetas from "./get-all-metas.js"
import getSelectorByText from "./get-selector-by-text.js"
import readSchemaNet from "./read-schema-net.js"
import { JSDOM } from "jsdom"

export default async function (html) {
  const document = new JSDOM(html)?.window?.document

  let { title, desc, author, date } = readSchemaNet(document)
  const metas = getAllMetas(document)

  if (!title) {
    title = metas.find((m) => m.prop === "og:title")
  }

  if (!desc) {
    desc = metas.find((m) => m.prop === "og:description")
  }

  if (!author) {
    term("\n")
    await term(`Copy and paste the author's name as you see in on the website:`)
    term("\n")

    const author_name = await term.inputField().promise
    term("\n")

    author = getSelectorByText(document, author_name)
  }

  if (!date) {
    date = metas.find(({ content }) => {
      let is_date = false
      try {
        let date = new Date(content)
        is_date = date instanceof Date && !isNaN(date.valueOf())
      } catch (e) {
        // it's ok
      }
      return is_date
    })
  }

  term("\n")
  await term(`Copy and paste the first few words of the first paragraph.`)
  term("\n")

  let first_para = await term.inputField().promise
  term("\n")

  first_para = getSelectorByText(document, first_para)

  term("\n")
  await term(`Copy and paste the first few words of the second paragraph.`)
  term("\n")

  let second_para = await term.inputField().promise
  term("\n")
  second_para = getSelectorByText(document, second_para)

  console.log(first_para)
  console.log(second_para)

  return {
    title,
    author,
    desc,
    date
  }
}
