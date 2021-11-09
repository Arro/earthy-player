import axios from "axios"
import terminalKit from "terminal-kit"
import filenamifyUrl from "filenamify-url"
import { pullFromCache, putIntoCache } from "#src/cache.js"
import os from "os"
import path from "path"

const term = terminalKit.terminal

term.on("key", function (name) {
  if (name === "CTRL_C") {
    process.exit()
  }
})

export default async function () {
  term("What is the url you want use?\n")
  const url = await term.inputField().promise
  term("\n\n")
  const cache_filename = path.join(
    os.homedir(),
    ".earthy-player",
    filenamifyUrl(url)
  )
  const cached_data = await pullFromCache(cache_filename, 2, "months")
  let html, first_para, second_para

  if (cached_data) {
    term(" Found data in the cache")
    html = cached_data.html
    first_para = cached_data.first_para
    second_para = cached_data.second_para
  } else {
    const spinner = await term.spinner("dotSpinner")
    term(" Fetching HTML from the url...")
    html = (await axios.get(url)).data
    spinner.destroy()
    term("\n")
    await term(`Copy and paste the first few words of the first paragraph.`)
    term("\n")

    first_para = await term.inputField().promise
    term("\n")

    term("\n")
    await term(`Copy and paste the first few words of the second paragraph.`)
    term("\n")

    second_para = await term.inputField().promise
    term("\n")

    await putIntoCache(cache_filename, { html, first_para, second_para })
  }

  return { html, first_para, second_para }
}
