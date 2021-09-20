#!/usr/bin/env node
import { terminal as term } from "terminal-kit"
import packageJson from "packageJson"
import path from "path"
import os from "os"
import fs from "fs-extra"
import dotenv from "dotenv"
import urlFetch from "./url-fetch"
import paginatedMenu from "src/cli/paginated-menu.js"
import htmlToSegments from "src/html-to-segments.js"
import condenseSegments from "src/condense-segments"
import textToSpeech from "src/text-to-speech"

dotenv.config()
;(async function () {
  term.on("key", function (name) {
    if (name === "CTRL_C") {
      process.exit()
    }
  })
  const logo_url = path.join(
    __dirname,
    "..",
    "..",
    "public",
    "img",
    "earthy-player-simple.jpg"
  )

  term.bgWhite.black(
    "                        Earthy Player                       "
  )
  term("\n")
  await term.drawImage(logo_url, {
    shrink: { width: 200, height: 30 }
  })

  await term.bgWhite.black(
    `                       Version ${packageJson.version}                        `
  )
  term("\n\n")

  await term(`How do you want to procede?`)
  term("\n")
  const menu_items = [
    {
      name: "Start with a webpage url",
      command: "by_url"
    },
    {
      name: "Start with an earthy-player config file",
      command: "by_config"
    },
    {
      name: "Verify my API keys are set up correctly",
      command: "verify"
    },
    {
      name: "Quit",
      command: "quit"
    }
  ]

  const choice = await paginatedMenu(menu_items, (m) => m.name)

  term("\n")

  if (choice.command === "by_url") {
    const { html, first_para, second_para } = await urlFetch()
    term("\n")

    let all_segments = await htmlToSegments({
      html,
      first_para,
      second_para
    })

    all_segments = await condenseSegments({
      segments: all_segments,
      max_chars: 4000
    })

    console.log(all_segments)

    term("\n")
    await term(
      `Give us a slug to use. (No spaces.  Example: 'my-cool-article')`
    )
    term("\n")

    let slug = await term.inputField().promise
    term("\n")

    const working_directory = path.join(os.tmpdir(), slug)
    await fs.mkdirp(working_directory)

    term("\n\n")
    const spinner = await term.spinner("dotSpinner")
    term(" Converting HTML to audio...")
    await textToSpeech({
      segments: all_segments,
      slug,
      working_directory,
      ffmpeg_path: process.env.ffmpeg_path
    })
    spinner.destroy()

    term("\n")
  }
  process.exit()
})()
