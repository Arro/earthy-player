export default function (document) {
  const schema = Array.from(
    document.querySelectorAll("script[type='application/ld+json']")
  )
    .map((t) => {
      const json = JSON.parse(t.textContent)
      return json
    })
    .find((s) => {
      return (
        s?.["@type"] === "NewsArticle" ||
        s?.["@type"] === "BlogPosting" ||
        s?.["@graph"]
      )
    })

  if (
    schema?.["@type"] === "NewsArticle" ||
    schema?.["@type"] === "BlogPosting"
  ) {
    return schema
  }

  return schema?.["@graph"]?.find((g) => {
    return g?.["@type"] === "NewsArticle"
  })
}
