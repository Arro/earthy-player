export default function (document) {
  let raw_metas = document.querySelectorAll("meta")

  let metas = []
  for (const meta of raw_metas) {
    const content = meta.getAttribute("content")
    const prop = meta.getAttribute("property")
    const name = meta.getAttribute("name")
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
