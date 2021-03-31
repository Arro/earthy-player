#!/usr/bin/env node
import { terminal as term } from "terminal-kit"
import packageJson from "../../package.json"
import path from "path"
import selectorWalkthrough from "./selector-walkthrough"
import urlFetch from "./url-fetch"
import paginatedMenu from "./paginated-menu.js"
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
    `                       Version ${packageJson.version}                       `
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
    const html = await urlFetch()
    term("\n")

    await selectorWalkthrough(html)

    term("\n")
  }
  process.exit()
})()
