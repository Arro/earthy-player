export default function (document, text) {
  let active_element = document.querySelector("body")
  let types = ["div", "span", "a", "li", "ul", "ol", "main", "nav", "header"]
  let selector = "body"
  while (active_element) {
    const children = Array.from(active_element.children).filter((el) => {
      return types.includes(el.tagName.toLowerCase())
    })
    active_element = children.find((el) => {
      return el.textContent.includes(text)
    })
    if (active_element) {
      if (active_element.className) {
        selector += ` > .${active_element.className.replaceAll(" ", ".")}`
      } else if (active_element.id) {
        selector += ` > #${active_element.id}`
      } else {
        selector += ` > ${active_element.tagName.toLowerCase()}`
      }

      if (active_element.textContent === text) {
        break
      }
    }
  }
  return selector
}
