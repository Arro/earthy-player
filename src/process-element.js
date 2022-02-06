import url from "url"

export default function ({
  text,
  type,
  class_name = "",
  discard_if_found,
  sound_effects,
  sound_effects_dir,
  voices,
  vocab = {}
}) {
  if (text === "") {
    return [null]
  }
  console.log(text)

  for (const d of discard_if_found) {
    if (text.indexOf(d) !== -1) {
      return [null]
    }
  }

  if (
    type === "blockquote" &&
    class_name === "twitter-tweet" &&
    sound_effects?.tweet_replacement &&
    sound_effects_dir
  ) {
    return [
      {
        filename: url.resolve(
          sound_effects_dir,
          sound_effects?.tweet_replacement
        ),
        type: "sound_effect",
        what: "tweet_replacment"
      }
    ]
  }
  if (
    type === "div" &&
    sound_effects?.unknown_replacement &&
    sound_effects_dir
  ) {
    return [
      {
        filename: url.resolve(
          sound_effects_dir,
          sound_effects?.unknown_replacement
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
    blockquote: "paragraph",
    div: "paragraph"
  }

  let what = element_to_what[type]

  let return_value = []

  let starts_with_location = /^[A-Z]+, [A-Z]+—/.exec(text)

  if (starts_with_location?.[0]?.length) {
    return_value.push({
      text: text.substring(0, starts_with_location[0].length - 1),
      what: "heading",
      ...voices.heading
    })
    text = text.substring(starts_with_location[0].length)
  }

  // replacing fancy quotes with regular ones to make regex simpler
  text = text.replaceAll(/[“”]/g, `"`)

  /*
  let has_quote
  do {
    has_quote = /(")(?:(?=(\\?))\2.)*?[,.]\1/.exec(text)
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
 */

  return_value.push({
    text,
    what,
    ...voices[what]
  })

  let prev
  return_value = return_value.map((segment) => {
    let starts_as_all_caps = segment.text === segment.text.toUpperCase()

    if (prev?.what === "quote") {
      const has_dash = /^[-—]\s/.exec(segment.text)
      if (has_dash) {
        segment.text = segment.text.substring(has_dash[0].length)
      }
    }

    for (let word_from in vocab) {
      const word_to = vocab[word_from]

      const re = RegExp(String.raw`(^|\s)${word_from}(\s|$)`, "g")
      segment.text = segment.text.replaceAll(re, `$1${word_to}$2`)
    }

    if (segment.what === "heading" && starts_as_all_caps) {
      segment.text = segment.text.toLowerCase()
    }

    segment.text = segment.text.replaceAll(/No(s?)\.\s(\d+)/gi, "Number$1 $2")

    if (!/[.!?;:,\\]$/.test(segment.text)) {
      segment.text += "."
    }

    prev = segment
    return segment
  })

  return return_value
}
