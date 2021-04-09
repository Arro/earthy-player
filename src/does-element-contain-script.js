export default function (element) {
  let script_found = element.querySelector("script")
  let image_found = element.querySelector("img")
  return script_found != undefined || image_found != undefined
}
