import { handleSegments, condenseSegments } from "./text-to-speech"

export default async function ({ segments, slug, working_directory = "/tmp" }) {
  if (!segments) {
    throw "No segments"
  }
  if (!slug) {
    throw "No slug"
  }
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    throw "No google API credentials"
  }

  const condensed = await condenseSegments(segments)
  return await handleSegments(condensed, slug, working_directory)
}
