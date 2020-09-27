import { spawn } from "promisify-child-process"
import moment from "moment"

export async function getAudioDuration({
  filename,
  ffprobe_path = "/usr/local/bin/ffprobe"
}) {
  const probe = spawn(ffprobe_path, ["-i", filename], {
    encoding: "utf-8",
    maxBuffer: "200 * 1024"
  })

  let duration = "3:00:00.00"
  probe.stderr.on(`data`, (data) => {
    data = data.toString()

    let poss_duration = data.match(/Duration: [0-9.:]*/g)
    if (poss_duration && poss_duration[0]) {
      duration = poss_duration[0].split(" ")[1]
    }
  })
  await probe

  duration = moment.duration(duration).asMilliseconds()

  return duration
}
