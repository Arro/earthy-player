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

export default async function (document) {
  let raw_metas = document.querySelectorAll("meta")

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
  return metas
}
