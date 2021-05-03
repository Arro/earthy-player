import getSelectorByText from "src/get-selector-by-text"

export default function (document, text_1, text_2) {
  const selector_1 = getSelectorByText(document, text_1)
  const selector_2 = getSelectorByText(document, text_2)

  let common_selector = []
  console.log(selector_1)
  console.log(selector_2)

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
      if (sel.type == "tag") {
        return `${comb} > ${sel.value}`
      } else if (sel.type == "class") {
        return `${comb} > .${sel.value.replaceAll(" ", ".")}`
      } else {
        return `${comb} > #${sel.value}`
      }
    }, "")
    .substr(3)
  return common_selector
}
