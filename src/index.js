import _textToSpeech from "./text-to-speech"
import _condenseSegments from "./condense-segments"
import _htmlToSegments from "./html-to-segments"
import _addChapterMetadata from "./add-chapter-metadata"

export async function htmlToSegments(args) {
  return await _htmlToSegments(args)
}
export async function condenseSegments(args) {
  return await _condenseSegments(args)
}

export async function addChapterMetadata(args) {
  return await _addChapterMetadata(args)
}

export async function textToSpeech(args) {
  return await _textToSpeech(args)
}
