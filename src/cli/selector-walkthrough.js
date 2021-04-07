import { terminal as term } from "terminal-kit"
import htmlToSegments from "../html-to-segments.js"

export default async function (html) {
  term("\n")
  await term(`Copy and paste the first few words of the first paragraph.`)
  term("\n")

  let first_para = await term.inputField().promise
  term("\n")

  term("\n")
  await term(`Copy and paste the first few words of the second paragraph.`)
  term("\n")

  let second_para = await term.inputField().promise
  term("\n")

  const segments = await htmlToSegments({
    html,
    first_para,
    second_para
  })
  // console.log(segments)
  return segments
}
