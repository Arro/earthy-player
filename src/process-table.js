import { JSDOM } from "jsdom"

export default function ({ html, voices, vocab = {} }) {
  const what = "list_item"
  html = `<html><body><table>${html}</table></body></html>`
  html = new JSDOM(html)

  const rows = html.window.document.querySelectorAll("tr")
  const num_columns = rows?.[0].querySelectorAll("td").length

  let return_val = []
  for (let i = 0; i < num_columns; i++) {
    for (const row of rows) {
      let text = row.querySelectorAll("td")?.[i].textContent
      if (!text.length) continue

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
  }

  return return_val
}
