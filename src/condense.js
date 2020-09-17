export default function ({ segments, max_chars = 4000 }) {
  let condensed = []

  let new_segments = []
  for (const segment of segments) {
    if (!segment.text || segment?.text?.length < max_chars) {
      new_segments.push({
        ...segment
      })
    } else {
      const working_max_chars = max_chars - 100
      for (
        let i = 0;
        i < Math.ceil(working_max_chars / (segment.text?.length || 0)) + 1;
        i++
      ) {
        // todo find a better split point
        const this_marker = i * working_max_chars
        const next_marker = (i + 1) * working_max_chars
        new_segments.push({
          ...segment,
          text: segment.text.substring(this_marker, next_marker)
        })
      }
    }
  }

  for (const segment of new_segments) {
    let prev_segment = condensed?.[condensed.length - 1]
    if (
      segment.type === "speech" &&
      prev_segment?.type === "speech" &&
      prev_segment?.what === segment.what &&
      prev_segment?.voice_name === segment.voice_name &&
      prev_segment?.text?.length + segment.text.length < max_chars
    ) {
      condensed[
        condensed.length - 1
      ].text = `${prev_segment.text}<break time="1s"/>${segment.text}`
    } else {
      condensed.push(segment)
    }
  }

  return condensed
}
