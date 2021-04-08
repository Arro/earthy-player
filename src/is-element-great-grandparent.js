export default function (element) {
  return Array.from(element.children).some((child) => {
    return Array.from(child.children).some((grandchild) => {
      return Array.from(grandchild.children).length
    })
  })
}
