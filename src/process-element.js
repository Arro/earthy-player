import path from "path"

export default function ({
  text,
  type,
  class_name = "",
  discard_if_found,
  sound_effects,
  sound_effects_dir,
  voices
}) {
  if (text === "") {
    return [null]
  }

  for (const d of discard_if_found) {
    if (text.indexOf(d) !== -1) {
      return [null]
    }
  }

  if (type === "blockquote" && class_name === "twitter-tweet") {
    return [
      {
        filename: path.resolve(
          `${sound_effects_dir}/${sound_effects?.tweet_replacement}`
        ),
        type: "sound_effect",
        what: "tweet_replacment"
      }
    ]
  }
  if (type === "div") {
    return [
      {
        filename: path.resolve(
          `${sound_effects_dir}/${sound_effects?.unknown_replacement}`
        ),
        type: "sound_effect",
        what: "unknown_replacment"
      }
    ]
  }
  const element_to_what = {
    h1: "heading",
    h2: "heading",
    h3: "heading",
    h4: "heading",
    h5: "heading",
    h6: "heading",
    li: "list_item",
    p: "paragraph",
    blockquote: "paragraph"
  }

  let what = element_to_what[type]

  let return_value = []

  let has_quote
  do {
    has_quote = /“.+”|".+"/.exec(text)
    if (has_quote) {
      if (has_quote.index > 0) {
        return_value.push({
          text: text.substring(0, has_quote.index).trim(),
          what: "paragraph",
          ...voices.paragraph
        })
      }
      return_value.push({
        text: text.substring(
          has_quote.index + 1,
          has_quote[0].length + has_quote.index - 1
        ),
        what: "quote",
        ...voices.quote
      })
      text = text.substring(has_quote[0].length + has_quote.index).trim()
    }
  } while (has_quote)

  return_value.push({
    text,
    what,
    ...voices[what]
  })

  let prev
  return_value = return_value.map((segment) => {
    if (!/[.!?;:,\\]$/.test(segment.text)) {
      segment.text += "."
    }
    if (prev?.what === "quote") {
      const has_dash = /^[-—]\s/.exec(segment.text)
      if (has_dash) {
        segment.text = segment.text.substring(has_dash[0].length)
      }
    }
    prev = segment
    return segment
  })

  return return_value
}
