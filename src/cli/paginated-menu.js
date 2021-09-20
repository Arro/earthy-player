import terminalKit from "terminal-kit"
const term = terminalKit.terminal

const menu_key_bindings = {
  UP: "previous",
  DOWN: "next",
  k: "previous",
  j: "next",
  ENTER: "submit"
}

term.on("key", function (name) {
  if (name === "CTRL_C") {
    process.exit()
  }
})

export default async function (options, contentFunc, clear_first = false) {
  let selection
  let page = 0
  let per_page = term.height - 3

  while (!selection) {
    if (page > 0 || clear_first) {
      term.clear()
    }
    const start_index = page * per_page
    const end_index = (page + 1) * per_page

    let choices = options
      .slice(start_index, end_index)
      .map(contentFunc)
      .map((content) => {
        return content.length > term.width - 3
          ? content.slice(0, 3) + "..."
          : content
      })
    let has_prev_option = false
    let has_next_option = false
    if (page > 0) {
      choices = ["--- PREV PAGE ---", ...choices]
      has_prev_option = true
    }
    if (options.length > end_index + 1) {
      choices = [...choices, "--- NEXT PAGE ---"]
      has_next_option = true
    }
    let result = await term.singleColumnMenu(choices, {
      keyBindings: menu_key_bindings
    }).promise

    if (has_prev_option && result.selectedIndex === 0) {
      page -= 1
    } else if (has_next_option && result.selectedIndex === choices.length - 1) {
      page += 1
    } else {
      selection =
        options[
          page * per_page + result.selectedIndex + (has_prev_option ? -1 : 0)
        ]
    }
  }

  return selection
}
