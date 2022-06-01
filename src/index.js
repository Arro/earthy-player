import _getMetadata from "./get-metadata.js"
import _textToSpeech from "./text-to-speech.js"
import _condenseSegments from "./condense-segments.js"
import _htmlToSegments from "./html-to-segments.js"
import _addChapterMetadata from "./add-chapter-metadata.js"

export async function getMetadata(args) {
  return await _getMetadata(args)
}
export async function htmlToSegments(args) {
  return await _htmlToSegments(args)
}
export async function condenseSegments(args) {
  return await _condenseSegments(args)
}
export async function textToSpeech(args) {
  return await _textToSpeech(args)
}
export async function addChapterMetadata(args) {
  return await _addChapterMetadata(args)
}
