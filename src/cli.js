#!/usr/bin/env node
import { terminal as term } from "terminal-kit"
import packageJson from "../package.json"
import path from "path"
;(async function () {
  term.on("key", function (name) {
    if (name === "CTRL_C") {
      process.exit()
    }
  })
  const logo_url = path.join(
    "__dirname",
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

  await term.white(`How do you want to procede?`)
  term("\n")
  const menu_items = [
    "Start with a webpage url",
    "Start with an earthy-player config file",
    "Verify my API keys are set up correctly",
    "Quit"
  ]

  const choice = await term.singleColumnMenu(menu_items, {
    keyBindings: {
      UP: "previous",
      DOWN: "next",
      k: "previous",
      j: "next",
      ENTER: "submit"
    }
  }).promise

  console.log(choice)
  process.exit()
})()
