import { JSDOM } from "jsdom"
import url from "url"
import path from "path"
import processElement from "./process-element"
import processTable from "./process-table"
import processList from "./process-list"
import default_voices from "./default-voices"
import default_top_level_types from "./default-top-level-types"
import getMetadata from "./get-metadata"
import isElementGreatGrandparent from "./is-element-great-grandparent"
import doesElementContainScript from "./does-element-contain-script"
import getSelectorByText from "./get-selector-by-text"

export default async function (args = {}) {
  let {
    html,
    first_para,
    second_para,
    top_level_types = default_top_level_types,
    voices = default_voices,
    sound_effects,
    sound_effects_dir,
    discard_if_found = [],
    no_desc = false,
    vocab = {}
  } = args
  if (!html?.length) {
    throw new Error("HTML not provided")
  }
  if (!first_para || !second_para) {
    throw new Error("Paragraphs not provided")
  }

  const document = new JSDOM(html)?.window?.document
  const { title, desc, date, author } = getMetadata(document)

  let first_para_selector = getSelectorByText(document, first_para)
  let second_para_selector = getSelectorByText(document, second_para)
  if (first_para_selector !== second_para_selector) {
    throw new Error("Can't figure out paragraph")
  }
  top_level_types = top_level_types.map((type) => {
    return `${first_para_selector} > ${type}`
  })

  const article_elements = document.querySelectorAll(top_level_types.join(","))

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

  segments.push({
    text: `${title}.`,
    language_code: `en-GB`,
    pitch: -5,
    speed: 1,
    type: "speech",
    what: "title"
  })

  if (desc && !no_desc) {
    segments.push({
      text: desc,
      language_code: `en-GB`,
      pitch: -5,
      speed: 1,
      type: "speech",
      what: "desc"
    })
  }

  let by_line = `Published on ${date}.`
  if (author) {
    by_line = `Published by ${author} on ${date}.`
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
    let pElements = []
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
      if (
        !isElementGreatGrandparent(element) &&
        !doesElementContainScript(element)
      ) {
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
    }
    for (const pElement of pElements) {
      if (pElement) {
        segments.push(pElement)
      }
    }
  }

  return segments
}
