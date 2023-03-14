#!/usr/bin/env node
import terminalKit from "terminal-kit"
import path from "path"
import os from "os"
import fs from "fs-extra"
import dotenv from "dotenv"
import urlFetch from "#src/cli/url-fetch.js"
import localFile from "#src/cli/local-file.js"
import paginatedMenu from "#src/cli/paginated-menu.js"
import htmlToSegments from "#src/html-to-segments.js"
import condenseSegments from "#src/condense-segments.js"
import textToSpeech from "#src/text-to-speech.js"

const term = terminalKit.terminal

dotenv.config()
;(async function () {
  term.on("key", function (name) {
    if (name === "CTRL_C") {
      process.exit()
    }
  })
  const logo_url = path.join("public", "img", "earthy-player-simple.jpg")

  term.bgWhite.black(
    "                        Earthy Player                       "
  )
  term("\n")
  await term.drawImage(logo_url, {
    shrink: { width: 200, height: 30 }
  })

  await term.bgWhite.black(
    `                       Version ${process.env.npm_package_version}                        `
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
      name: "Start with a local html filename",
      command: "by_filename"
    },
    {
      name: "Verify my API keys are set up correctly",
      command: "verify"
    },
    {
      name: "Start with an earthy-player config file",
      command: "by_config"
    },
    {
      name: "Quit",
      command: "quit"
    }
  ]

  const choice = await paginatedMenu(menu_items, (m) => m.name)

  term("\n")

  let html, first_para, second_para
  if (choice.command === "by_url") {
    const result = await urlFetch()
    html = result.html
    first_para = result.first_para
    second_para = result.second_para
    term("\n")
  } else if (choice.command === "by_filename") {
    const result = await localFile()
    html = result.html
    first_para = result.first_para
    second_para = result.first_para
    term("\n")
  } else {
    process.exit()
  }

  await term(`Which synthesizer would you like to use?`)
  term("\n")
  const menu_items_2 = [
    {
      name: "Google WaveNet",
      synthesizer: "google"
    },
    {
      name: "Eleven Labs",
      sythesizer: "eleven"
    }
  ]
  const next_choice = await paginatedMenu(menu_items_2, (m) => m.name)

  let all_segments = await htmlToSegments({
    html,
    first_para,
    second_para
  })
  console.log(`\nall_segments`)
  console.log(all_segments)

  all_segments = await condenseSegments({
    segments: all_segments,
    max_chars: 4000,
    synthesizer: next_choice.sythesizer
  })

  console.log(`\npost condense all_segments`)
  console.log(all_segments)

  term("\n")
  await term(`Give us a slug to use. (No spaces.  Example: 'my-cool-article')`)
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
    ffmpeg_path: process.env.ffmpeg_path,
    synthesizer: next_choice.sythesizer
  })
  spinner.destroy()

  term("\n")
  process.exit()
})()
