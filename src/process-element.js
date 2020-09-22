export default function ({ element, discard_if_found, sound_effects, voices }) {
  const type = element.nodeName?.toLowerCase()
  const class_name = element.className
  let text = element.textContent.trim()

  if (text === "") {
    return null
  }

  for (const d of discard_if_found) {
    if (text.indexOf(d) !== -1) {
      return null
    }
  }

  if (type === "blockquote" && class_name === "twitter-tweet") {
    return {
      filename: sound_effects?.tweet_replacement,
      type: "sound_effect",
      what: "tweet_replacment"
    }
  }
  if (type === "div") {
    return {
      filename: sound_effects?.unknown_replacement,
      type: "sound_effect",
      what: "unknown_replacment"
    }
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

  if (
    what === "paragraph" &&
    text[0] === "“" &&
    text[text.length - 1] === "”"
  ) {
    what = "quote"
    text = text.substr(1, text.length - 2)
  }

  if (!/[.!?;:,\\]$/.test(text)) {
    text = `${text}.`
  }

  const args = voices[what]

  return {
    text,
    what,
    ...args
  }
}
