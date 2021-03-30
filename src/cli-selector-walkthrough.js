import { JSDOM } from "jsdom"
const invalid_meta_names = [
  "viewport",
  "thumbnail",
  "apple-itunes-app",
  "theme-color",
  "twitter:image",
  "twitter:card",
  "twitter:site"
]
const invalid_meta_props = [
  "og:locale",
  "snapchat:sticker",
  "fb:app_id",
  "og:image",
  "og:url",
  "snapchat:publisher",
  "og:type"
]

export default async function (term, html, menu_key_bindings) {
  html = new JSDOM(html)

  let raw_metas = html.window.document.querySelectorAll("meta")

  let metas = []
  for (const meta of raw_metas) {
    const content = meta.getAttribute("content")
    const prop = meta.getAttribute("property")
    const name = meta.getAttribute("name")
    if (invalid_meta_names.includes(name)) {
      continue
    }
    if (invalid_meta_props.includes(prop)) {
      continue
    }
    if (!content) {
      continue
    }
    if (!prop && !name) {
      continue
    }

    metas.push({
      content,
      prop,
      name
    })
  }

  term("\n")
  await term(`Which one of these is the best title?`)
  term("\n")

  let { selectedIndex: title_choice_index } = await term.singleColumnMenu(
    metas.map((m) => m.content),
    {
      keyBindings: menu_key_bindings
    }
  ).promise

  console.log(title_choice_index)
  const title_choice = metas[title_choice_index]
  metas.splice(title_choice_index, 1)

  term("\n")
  await term(`Which one of these is the best description?`)
  term("\n")

  let { selectedIndex: desc_choice_index } = await term.singleColumnMenu(
    metas.map((m) => m.content),
    {
      keyBindings: menu_key_bindings
    }
  ).promise

  console.log(desc_choice_index)
  const desc_choice = metas[desc_choice_index]
  metas.splice(desc_choice_index, 1)

  var all_class_names = []
  var all_elements = html.window.document.querySelectorAll("*")

  for (let i = 0; i < all_elements.length; i++) {
    var classes = all_elements[i].className.toString().split(/\s+/)
    for (let j = 0; j < classes.length; j++) {
      let cls = classes[j]
      if (cls && all_class_names.indexOf(cls) === -1) all_class_names.push(cls)
    }
  }

  const elements = []
  for (const class_name of all_class_names) {
    let text
    try {
      text = html.window.document.querySelector(`.${class_name}`).textContent
    } catch (e) {
      continue
    }
    // console.log(text)
    if (text.length > 100 || text.length < 3) {
      continue
    }
    elements.push({
      text,
      class_name
    })
  }

  let author_choice
  let page = 0
  let per_page = 10
  while (!author_choice) {
    term.clear()
    let choices = elements
      .slice(page * per_page, (page + 1) * per_page)
      .map((m) => m.text)
    choices.push("NONE OF THESE")
    let result = await term.singleColumnMenu(choices, {
      keyBindings: menu_key_bindings
    }).promise

    if (result.selectedIndex < per_page) {
      author_choice = elements[page * per_page + result.selectedIndex]
    } else {
      page += 1
    }
  }

  console.log(title_choice)
  console.log(desc_choice)
  console.log(author_choice)

  return
}
