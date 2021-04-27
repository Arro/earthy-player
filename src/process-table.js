import { JSDOM } from "jsdom"

export default function ({ html, voices, vocab = {} }) {
  const what = "list_item"
  html = `<html><body><table>${html}</table></body></html>`
  html = new JSDOM(html)

  let rows = Array.from(html.window.document.querySelectorAll("tr"))

  let average_num_columns = Math.round(
    rows.reduce((sum, row) => {
      return sum + row.querySelectorAll("td,th").length
    }, 0) / rows.length
  )

  // throw out rows with wrong number of columns
  rows = rows.filter((row) => {
    return row.querySelectorAll("td,th").length == average_num_columns
  })

  let header_row
  if (rows?.[0].querySelector("th")) {
    header_row = Array.from(rows[0].querySelectorAll("th")).map(
      (header_row) => {
        header_row.innerHTML = header_row.innerHTML.replaceAll("<br>", " ")
        header_row.innerHTML = header_row.innerHTML.replaceAll("[Note 2]", "") // workaround
        let text = header_row.textContent.trim()
        if (!/[.!?;:,\\]$/.test(text)) {
          text += "."
        }
        return text
      }
    )
    rows = rows.slice(1)
  }

  // throw out rows with display:none
  rows = rows.filter((row) => {
    return row?.style?.display !== "none"
  })

  let return_val = []
  for (const row of rows) {
    for (let i = 0; i < average_num_columns; i++) {
      const cell = row.querySelectorAll("td")?.[i]

      // get rid of hidden spans
      for (const bad_thing of cell.querySelectorAll(
        "span[style*='display:none']"
      )) {
        bad_thing.innerHTML = ""
      }

      let text = cell.textContent.trim()

      if (!text.length) continue

      // workaround, for now
      if (header_row?.[i] == "References") continue

      if (header_row?.[i]) {
        text = `${header_row?.[i]}<break time="400ms"/>${text}`
      }

      for (let word_from in vocab) {
        const word_to = vocab[word_from]
        const re = RegExp(String.raw`(^|\s)${word_from}(\s|$)`, "g")
        text = text.replaceAll(re, `$1${word_to}$2`)
      }

      if (!/[.!?;:,\\]$/.test(text)) {
        text += "."
      }

      return_val.push({
        text: text.trim(),
        what,
        ...voices[what]
      })
    }
  }

  // console.log(return_val)

  return return_val
}
