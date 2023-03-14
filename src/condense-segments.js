export default function ({
  segments,
  max_chars = 4000,
  synthesizer = "google"
}) {
  let condensed = []
  console.log(`\n\n`)
  console.log(synthesizer)
  console.log(`\n\n`)

  let new_segments = []
  for (const segment of segments) {
    if (!segment.text || segment?.text?.length < max_chars) {
      console.log("pushing under cond 1")
      new_segments.push({
        ...segment
      })
    } else {
      const working_max_chars = max_chars - 100
      for (
        let i = 0;
        i < Math.ceil(working_max_chars / (segment.text?.length || 0)) + 2;
        i++
      ) {
        // todo find a better split point
        const this_marker = i * working_max_chars
        const next_marker = (i + 1) * working_max_chars
        console.log("pushing under cond 2")
        new_segments.push({
          ...segment,
          text: segment.text.substring(this_marker, next_marker)
        })
      }
      console.log(new_segments)
      console.log(`\n\n`)
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
      if (synthesizer === "google") {
        condensed[
          condensed.length - 1
        ].text = `${prev_segment.text}<break time="1s"/>${segment.text}`
      } else {
        condensed[
          condensed.length - 1
        ].text = `${prev_segment.text}\n...\n${segment.text}`
      }
    } else {
      condensed.push(segment)
    }
  }

  return condensed
}
