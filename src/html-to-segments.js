import { JSDOM } from "jsdom"
import url from "url"
import path from "path"
import processElement from "./process-element.js"
import processTable from "./process-table.js"
import processList from "./process-list.js"
import default_voices from "./default-voices.js"
// import default_top_level_types from "./default-top-level-types"
import getMetadata from "./get-metadata.js"
// import isElementGreatGrandparent from "./is-element-great-grandparent"
import doesElementContainScript from "./does-element-contain-script.js"
import getNearestCommonAncestor from "./get-nearest-common-ancestor.js"

export default async function (args = {}) {
  let {
    html,
    first_para,
    second_para,
    // top_level_types = default_top_level_types,
    voices = default_voices,
    sound_effects,
    sound_effects_dir,
    discard_if_found = [],
    no_desc = false,
    selector = null,
    vocab = {}
  } = args
  if (!html?.length) {
    throw new Error("HTML not provided")
  }
  const document = new JSDOM(html)?.window?.document
  let nearest_common_sel

  if (selector) {
    nearest_common_sel = selector
  } else {
    if (!first_para || !second_para) {
      throw new Error("Paragraphs not provided")
    }
    nearest_common_sel = getNearestCommonAncestor(
      document,
      first_para,
      second_para
    )
  }
  const { title, desc, date, author } = getMetadata(document)

  // let first_para_selector = getSelectorByText(document, first_para)
  // let second_para_selector = getSelectorByText(document, second_para)

  if (!nearest_common_sel?.length) {
    throw new Error("Can't figure out paragraph")
  }
  /*
  top_level_types = top_level_types.map((type) => {
    return `${nearest_common_sel} > ${type}`
  })
  console.log(`\n\n\n`)
  console.log(top_level_types)
  console.log(`\n\n\n`)
  const article_elements = document.querySelectorAll(top_level_types.join(","))
 */
  const article_elements = document.querySelectorAll(nearest_common_sel)
  /*
  // console.log(article_elements)

  console.log(Array.from(article_elements).length)
  for (const a of article_elements) {
    console.log(a.textContent)
  }
  */

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
    // console.log(element.textContent)
    if (element.className == "toc") {
      continue
    }
    if (segments?.[segments.length - 1]?.text === "Footnotes[edit].") {
      break
    }

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
        // !isElementGreatGrandparent(element) &&
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
