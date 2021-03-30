import axios from "axios"

export default async function (term) {
  term("What is the url you want use?\n")
  const url = await term.inputField().promise
  let { data: html } = await axios.get(url)
  return html
}
