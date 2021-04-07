export default function (element) {
  return Array.from(element.children).some((child) => {
    return child.nodeName === "SCRIPT"
  })
}
