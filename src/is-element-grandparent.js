export default function (element) {
  return Array.from(element.children).some((children) => {
    return Array.from(children.children).length
  })
}
