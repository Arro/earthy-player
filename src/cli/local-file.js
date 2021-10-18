import terminalKit from "terminal-kit"
import fs from "fs-extra"

const term = terminalKit.terminal

term.on("key", function (name) {
  if (name === "CTRL_C") {
    process.exit()
  }
})

export default async function () {
  let html, first_para, second_para
  term("What is the filename you want use?\n")
  const filename = await term.inputField().promise
  term("\n\n")
  html = await fs.readFile(filename, "utf-8")
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

  return { html, first_para, second_para }
}
