export default function (document, text_1, text_2) {
  const selector_1 = _getSelectorArrayByText(document, text_1)
  const selector_2 = _getSelectorArrayByText(document, text_2)

  let common_selector = []

  for (let i = 0; i < selector_1.length; i++) {
    const sel_1 = selector_1[i]
    const sel_2 = selector_2[i]
    if (sel_1?.type !== sel_2?.type) {
      break
    }
    if (sel_1?.value === sel_2?.value) {
      common_selector.push(sel_1)
    } else if (sel_1.type === "class") {
      const split_1 = new Set(sel_1.value.split(" "))
      const split_2 = new Set(sel_2.value.split(" "))
      const intersection = [...split_1].filter((x) => split_2?.has(x))
      if (intersection.length) {
        common_selector.push({
          type: "class",
          value: intersection.join(" ")
        })
      }
    } else {
      break
    }
  }

  common_selector = common_selector
    .reduce((comb, sel) => {
      console.log(sel)
      if (sel.type == "tag") {
        return `${comb} > ${sel.value}`
      } else if (sel.type == "class") {
        return `${comb} > .${sel.value
          .replaceAll("  ", " ")
          .replaceAll(" ", ".")}`
      } else {
        return `${comb} > #${sel.value}`
      }
    }, "")
    .substr(3)
  return common_selector
}

function _getSelectorArrayByText(document, text) {
  let active_element = document.querySelector("body")
  let types = [
    "div",
    "p",
    "span",
    "a",
    "li",
    "ul",
    "ol",
    "main",
    "nav",
    "header",
    "section",
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
