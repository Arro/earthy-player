export default function ({
  text,
  type,
  class_name = "",
  discard_if_found,
  sound_effects,
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
        filename: sound_effects?.tweet_replacement,
        type: "sound_effect",
        what: "tweet_replacment"
      }
    ]
  }
  if (type === "div") {
    return [
      {
        filename: sound_effects?.unknown_replacement,
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
          has_quote.index,
          has_quote[0].length + has_quote.index
        ),
        what: "quote",
        ...voices.quote
      })
      text = text.substring(has_quote[0].length + has_quote.index).trim()
    }
  } while (has_quote)

  if (!/[.!?;:,\\]$/.test(text)) {
    text = `${text}.`
  }

  return [
    ...return_value,
    {
      text,
      what,
      ...voices[what]
    }
  ]
}
