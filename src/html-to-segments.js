import { JSDOM } from "jsdom"
import path from "path"
import moment from "moment"

export default async function (args = {}) {
  let {
    html,
    selectors,
    top_level_types,
    sound_effects,
    sound_effects_dir
  } = args
  if (!html?.length) {
    throw new Error("HTML not provided")
  }
  if (!top_level_types?.length) {
    throw new Error("Top level types not provided")
  }
  if (!selectors) {
    throw new Error("Selectors not provided")
  }
  if (!sound_effects || !sound_effects_dir) {
    throw new Error("Sound effects or sound effects directory not provided")
  }

  html = new JSDOM(html)

  top_level_types = top_level_types.map((type) => {
    return `${selectors?.parent} > ${type}`
  })

  const article_elements = html.window.document.querySelectorAll(
    top_level_types.join(",")
  )
  console.log(article_elements.length)

  let segments = []

  segments.push({
    filename: path.join(sound_effects_dir, sound_effects?.start),
    type: "sound_effect",
    what: "start_of_article"
  })

  const article_title = html.window.document.querySelector(selectors?.title)
    .textContent

  segments.push({
    text: `${article_title}.`,
    language_code: `en-GB`,
    pitch: -5,
    speed: 1,
    type: "speech",
    what: "title"
  })

  const article_by = html.window.document
    .querySelector(selectors?.by)
    .textContent.trim()
    .split("\n")?.[0]
    .trim()

  segments.push({
    text: `${article_by}.`,
    voice_name: `en-GB-Wavenet-B`,
    language_code: `en-GB`,
    pitch: -5,
    speed: 1,
    type: "speech",
    what: "by"
  })

  let article_date = html.window.document
    .querySelector(selectors?.date)
    .textContent.trim()
    .split("\n")?.[1]
    .trim()

  article_date = moment(article_date, selectors?.date_format).format(
    "[On] dddd, MMMM Do YYYY[.]"
  )

  segments.push({
    text: article_date,
    voice_name: `en-GB-Wavenet-B`,
    language_code: `en-GB`,
    pitch: -5,
    speed: 1,
    type: "speech",
    what: "date"
  })

  return segments
}
