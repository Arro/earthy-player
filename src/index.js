import textToSpeech from "./text-to-speech"
import _condenseSegments from "./condense-segments"
import _htmlToSegments from "./html-to-segments"
import _addChapterMetadata from "./add-chapter-metadata"

export async function htmlToSegments(args) {
  return await _htmlToSegments(args)
}
export async function condenseSegments({ segments, max_chars }) {
  return await _condenseSegments({ segments, max_chars })
}

export async function addChapterMetadata({
  segments,
  slug,
  working_directory,
  artist
}) {
  return await _addChapterMetadata({
    segments,
    slug,
    working_directory,
    artist
  })
}

export async function main(args) {
  return await textToSpeech(args)
}
