import axios from "axios"
import { terminal as term } from "terminal-kit"

term.on("key", function (name) {
  if (name === "CTRL_C") {
    process.exit()
  }
})

export default async function () {
  term("What is the url you want use?\n")
  const url = await term.inputField().promise
  term("\n\n")
  const spinner = await term.spinner("dotSpinner")
  term(" Fetching HTML from the url...")
  let { data: html } = await axios.get(url)
  spinner.destroy()
  return html
}
