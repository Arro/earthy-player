export default function (document, text) {
  let active_element = document.querySelector("body")
  let types = [
    "div",
    "span",
    "a",
    "li",
    "ul",
    "ol",
    "main",
    "nav",
    "header",
    "article"
  ]
  let selector = [{ type: "tag", value: "body" }]
  while (active_element) {
    const children = Array.from(active_element.children).filter((el) => {
      return types.includes(el.tagName.toLowerCase())
    })
    active_element = children.find((el) => {
      return el.textContent.includes(text)
    })
    if (active_element) {
      if (active_element.className) {
        selector.push({
          type: "class",
          value: active_element.className.trim()
        })
      } else if (active_element.id) {
        selector.push({
          type: "id",
          value: active_element.id
        })
      } else {
        selector.push({
          type: "tag",
          value: active_element.tagName.toLowerCase()
        })
      }

      if (active_element.textContent === text) {
        break
      }
    }
  }
  return selector
}
