export default function (document) {
  let schema
  let raw_schema = Array.from(
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
    raw_schema?.["@type"] === "NewsArticle" ||
    raw_schema?.["@type"] === "BlogPosting"
  ) {
    schema = raw_schema
  } else {
    schema = raw_schema?.["@graph"]?.find((g) => {
      return g?.["@type"] === "NewsArticle"
    })
  }

  return {
    title: schema?.headline,
    desc: schema?.description,
    date: schema?.datePublished,
    author: schema?.author?.name || schema?.author?.[0].name
  }
}
