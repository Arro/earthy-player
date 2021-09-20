import fs from "fs-extra"
import path from "path"
import moment from "moment"

export async function pullFromCache(cache_filename, time_unit, time_amount) {
  if (!(await fs.exists(cache_filename))) {
    return
  }

  const cache_contents = JSON.parse(await fs.readFile(cache_filename, "utf-8"))

  if (!cache_contents?.last_fetch) {
    return
  }

  let is_recent = true
  if (time_unit && time_amount) {
    is_recent = moment(cache_contents?.last_fetch).isAfter(
      moment().subtract(time_unit, time_amount)
    )
  }

  if (is_recent) {
    return cache_contents.data
  }
}

export async function putIntoCache(cache_filename, data) {
  await fs.mkdirp(path.dirname(cache_filename))
  await fs.writeFile(
    cache_filename,
    JSON.stringify({ data, last_fetch: new Date() }, null, 2),
    "utf-8"
  )
}
