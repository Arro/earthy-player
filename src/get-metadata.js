import moment from "moment-timezone"

export default function (document, force_no_schema = false) {
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
        s?.["@type"] === "Article" ||
        s?.["@type"] === "BlogPosting" ||
        s?.["@graph"]
      )
    })

  if (
    raw_schema?.["@type"] === "NewsArticle" ||
    raw_schema?.["@type"] === "Article" ||
    raw_schema?.["@type"] === "BlogPosting"
  ) {
    schema = raw_schema
  } else {
    schema = raw_schema?.["@graph"]?.find((g) => {
      return g?.["@type"] === "NewsArticle"
    })
  }
  let title, desc, date, author

  if (!force_no_schema) {
    title = schema?.headline
    desc = schema?.description?.trim()
    date = schema?.datePublished
    author = schema?.author?.name || schema?.author?.[0]?.name
  }

  if (!title) {
    title = document
      .querySelector("meta[property='og:title']")
      ?.getAttribute("content")
  }

  if (!desc) {
    desc = document
      .querySelector("meta[property='og:description']")
      ?.getAttribute("content")
      ?.trim()
  }

  if (!author) {
    author = document
      .querySelector("meta[property='article:author']")
      ?.getAttribute("content")
  }

  if (!date) {
    date = document
      .querySelector("meta[property='article:published_time']")
      ?.getAttribute("content")
  }

  if (date) {
    date = moment.tz(date, "America/New_York").format("dddd, MMMM Do, YYYY")
  }

  return { title, desc, date, author }
}
