import { JSDOM } from "jsdom"

export default async function (args = {}) {
  let { html, parent_selector, top_level_types } = args
  // sound_effects
  if (!html?.length) {
    throw new Error("HTML not provided")
  }
  if (!top_level_types?.length) {
    throw new Error("Top level types not provided")
  }
  if (!parent_selector?.length) {
    throw new Error("Parent selector not provided")
  }

  html = new JSDOM(html)

  top_level_types = top_level_types.map((type) => {
    return `${parent_selector} > ${type}`
  })

  const article_elements = html.window.document.querySelectorAll(
    top_level_types.join(",")
  )
  console.log(article_elements)
}
