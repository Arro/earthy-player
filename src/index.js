import textToSpeech from "./text-to-speech"
import condense from "./condense"
import _htmlToSegments from "./html-to-segments"

export async function htmlToSegments(args) {
  return await _htmlToSegments(args)
}

export async function main({ segments, slug, working_directory, max_chars }) {
  const condensed = condense({ segments, max_chars })
  return await textToSpeech({ segments: condensed, slug, working_directory })
}
