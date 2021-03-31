import { terminal as term } from "terminal-kit"
import paginatedMenu from "./paginated-menu.js"
import getAllMetas from "./get-all-metas.js"
import { JSDOM } from "jsdom"

export default async function (html) {
  html = new JSDOM(html)

  const metas = await getAllMetas(html.window.document)

  term("\n")
  await term(`Which one of these is the best title?`)
  term("\n")

  const title_choice = await paginatedMenu(metas, (m) => m.content)

  term("\n")
  await term(`Which one of these is the best description?`)
  term("\n")

  const desc_choice = await paginatedMenu(metas, (m) => m.content)

  var all_class_names = []
  var all_elements = html.window.document.querySelectorAll("*")

  for (let i = 0; i < all_elements.length; i++) {
    var classes = all_elements[i].className.toString().split(/\s+/)
    for (let j = 0; j < classes.length; j++) {
      let cls = classes[j]
      if (cls && all_class_names.indexOf(cls) === -1) all_class_names.push(cls)
    }
  }

  const elements = []
  for (const class_name of all_class_names) {
    let text
    try {
      text = html.window.document.querySelector(`.${class_name}`).textContent
    } catch (e) {
      continue
    }
    // console.log(text)
    if (text.length > 100 || text.length < 3) {
      continue
    }
    elements.push({
      text,
      class_name
    })
  }

  const author_choice = await paginatedMenu(elements, (m) => m.text)

  console.log(title_choice)
  console.log(desc_choice)
  console.log(author_choice)

  return
}
