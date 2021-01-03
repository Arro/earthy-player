import os from "os"
import path from "path"

import axios from "axios"
import fs from "fs-extra"

import { htmlToSegments, textToSpeech } from "earthy-player"
;(async function () {
  const article_url =
    "https://local.theonion.com/cat-seemed-perfectly-content-right-up-until-point-he-bo-1819575397"

  let { data: html } = await axios.get(article_url)

  let selectors = {
    parent: ".js_post-content",
    top_level_types: ["p"],
    title: "meta[name='twitter:title']",
    by: "meta[name='author']",
    date: "meta[name='publish-date']"
  }

  let segments = await htmlToSegments({
    html,
    selectors,
    vocab: {
      NJ: "New Jersey"
    }
  })
  const slug = "readme-cat"

  const working_directory = path.join(os.homedir(), "Downloads", slug)
  console.log(`Check your ~/Downloads folder for a folder called "readme-cat"`)
  await fs.mkdirp(working_directory)

  await textToSpeech({
    segments,
    slug,
    working_directory,
    ffmpeg_path: "/usr/local/bin/ffmpeg"
  })
})()
