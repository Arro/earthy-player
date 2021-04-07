import { JSDOM } from "jsdom"
import url from "url"
import path from "path"
import moment from "moment-timezone"
import processElement from "./process-element"
import processTable from "./process-table"
import processList from "./process-list"
import default_voices from "./default-voices"
import default_top_level_types from "./default-top-level-types"
import readSchemaNet from "./cli/read-schema-net"
import isElementGrandparent from "./is-element-grandparent"
import doesElementContainScript from "./does-element-contain-script"
import getSelectorByText from "./cli/get-selector-by-text"

export default async function (args = {}) {
  let {
    html,
    selectors = {},
    sound_effects,
    sound_effects_dir,
    first_para,
    second_para,
    voices = default_voices,
    discard_if_found = [],
    vocab = {}
  } = args
  if (!html?.length) {
    throw new Error("HTML not provided")
  }

  if (!selectors.top_level_types) {
    selectors.top_level_types = default_top_level_types
  }

  html = new JSDOM(html)
  const document = html.window.document
  const schema = readSchemaNet(document)

  let top_level_types = []
  if (first_para && second_para) {
    let first_para_selector = getSelectorByText(document, first_para)
    let second_para_selector = getSelectorByText(document, second_para)
    if (first_para_selector !== second_para_selector) {
      throw new Error("Can't figure out paragraph")
    }
    top_level_types = selectors?.top_level_types.map((type) => {
      return `${first_para_selector} > ${type}`
    })
  } else {
    top_level_types = selectors?.top_level_types.map((type) => {
      return `${selectors?.parent} > ${type}`
    })
  }

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

  let content = {}

  for (const part of ["title", "desc", "author", "date"]) {
    if (schema[part]) {
      content[part] = schema[part]
    } else {
      content[part] = html.window.document.querySelector(selectors?.[part])

      if (content[part]?.nodeName == "meta") {
        content[part] = content[part]?.getAttribute("content")
      } else {
        content[part] = content[part]?.textContent
      }
    }
    content[part] = content[part]?.trim()

    if (part === "date") {
      content[part] = moment
        .tz(content[part], "America/New_York")
        .format("dddd, MMMM Do, YYYY")
    }
  }

  segments.push({
    text: `${content["title"]}.`,
    language_code: `en-GB`,
    pitch: -5,
    speed: 1,
    type: "speech",
    what: "title"
  })

  if (content["desc"]) {
    segments.push({
      text: content["desc"],
      language_code: `en-GB`,
      pitch: -5,
      speed: 1,
      type: "speech",
      what: "desc"
    })
  }

  let by_line = `Published on ${content["date"]}.`
  if (content["author"]) {
    by_line = `Published by ${content["author"]} on ${content["date"]}.`
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
        !isElementGrandparent(element) &&
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
