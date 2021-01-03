import { JSDOM } from "jsdom"
import url from "url"
import path from "path"
import moment from "moment"
import processElement from "./process-element"
import processTable from "./process-table"
import processList from "./process-list"
import default_voices from "./default-voices"

export default async function (args = {}) {
  let {
    html,
    selectors,
    sound_effects,
    sound_effects_dir,
    voices = default_voices,
    discard_if_found = [],
    vocab = {}
  } = args
  if (!html?.length) {
    throw new Error("HTML not provided")
  }
  if (!selectors) {
    throw new Error("Selectors not provided")
  }

  html = new JSDOM(html)

  let top_level_types = selectors?.top_level_types.map((type) => {
    return `${selectors?.parent} > ${type}`
  })

  const article_elements = html.window.document.querySelectorAll(
    top_level_types.join(",")
  )

  let segments = []

  if (sound_effects_dir && sound_effects?.start) {
    let filename
    if (/^http/.test(sound_effects_dir)) {
      filename = url.resolve(sound_effects_dir, sound_effects?.start)
    } else {
      filename = path.join(sound_effects_dir, sound_effects?.start)
    }

    segments.push({
      filename,
      type: "sound_effect",
      what: "start_of_article"
    })
  }

  const article_title = html.window.document
    .querySelector(selectors?.title)
    .getAttribute("content")

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
    .getAttribute("content")

  let article_date = html.window.document
    .querySelector(selectors?.date)
    .getAttribute("content")

  article_date = moment(article_date, selectors?.date_format).format(
    "dddd, MMMM Do, YYYY"
  )

  let by_line = `Published on ${article_date}.`
  if (article_by) {
    by_line = `By ${article_by} on ${article_date}.`
  }

  segments.push({
    text: by_line,
    voice_name: `en-GB-Wavenet-B`,
    language_code: `en-GB`,
    pitch: -5,
    speed: 1,
    type: "speech",
    what: "author-and-date"
  })

  for (const element of article_elements) {
    const type = element.nodeName?.toLowerCase()
    let pElements
    if (type === "table") {
      pElements = processTable({
        html: element.innerHTML,
        voices,
        vocab
      })
    } else if (type === "ol" || type === "ul") {
      pElements = processList({
        html: element.innerHTML,
        type,
        voices,
        sound_effects,
        sound_effects_dir,
        vocab
      })
    } else {
      pElements = processElement({
        text: element.textContent.trim(),
        type,
        class_name: element.className,
        discard_if_found,
        sound_effects,
        sound_effects_dir,
        voices,
        vocab
      })
    }
    for (const pElement of pElements) {
      if (pElement) {
        segments.push(pElement)
      }
    }
  }

  return segments
}
