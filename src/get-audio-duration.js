import child_process from "child_process"
import util from "util"

import moment from "moment"

const exec = util.promisify(child_process.exec)

export async function getAudioDuration({
  filename,
  ffprobe_path = "/usr/local/bin/ffprobe"
}) {
  let duration = "3:00:00.00"
  let result = await exec(`${ffprobe_path} -i ${filename}`, {
    encoding: "utf-8"
  })
  duration = /Duration: ([0-9:.]+)/g.exec(result?.stderr)?.[1]

  duration = moment.duration(duration).asMilliseconds()

  return duration
}
