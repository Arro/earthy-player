import { JSDOM } from "jsdom"
import path from "path"

export default function ({
  html,
  type,
  voices,
  sound_effects,
  sound_effects_dir,
  vocab
}) {
  const what = "list_item"
  html = `<html><body><${type}>${html}</${type}></body></html>`
  html = new JSDOM(html)

  const list_items = html.window.document.querySelectorAll("li")

  let return_val = []
  for (const [i, list_item] of list_items.entries()) {
    if (type === "ol") {
      return_val.push({
        text: `Number ${i + 1}.`,
        what: "heading",
        ...voices.heading
      })
    } else {
      return_val.push({
        filename: path.resolve(
          `${sound_effects_dir}/${sound_effects?.list_item_marker}`
        ),
        type: "sound_effect",
        what: "list_item_marker"
      })
    }
    let text = list_item.textContent

    for (let word_from in vocab) {
      const word_to = vocab[word_from]
      if (text == word_from) {
        text = word_to
      } else {
        text = text.replaceAll(` ${word_from} `, ` ${word_to} `)
      }
    }

    if (!/[.!?;:,\\]$/.test(text)) {
      text += "."
    }

    return_val.push({
      text,
      what,
      ...voices[what]
    })
  }

  return return_val
}
