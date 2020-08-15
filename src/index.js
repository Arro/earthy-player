import main from "./text-to-speech"
import condense from "./condense"

export default async function ({
  segments,
  slug,
  working_directory,
  max_chars
}) {
  const condensed = condense({ segments, max_chars })
  await main({ segments: condensed, slug, working_directory })
}
