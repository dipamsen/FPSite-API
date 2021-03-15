const { Dropbox } = require("dropbox")

require("dotenv").config()
// console.log(process)
const FOLDER_NAME = "fpsite-files"

const db = new Dropbox({
  accessToken: process.env.DROPBOX_ACCESS_TOKEN,
  clientId: process.env.DROPBOX_CLIENT_ID,
  clientSecret: process.env.DROPBOX_CLIENT_SECRET
})


/**
 * @param {import("./idnex").Subject} subject
 */
async function getChapters(subject) {
  // try {
  const { result } = await db.filesListFolder({ path: `/${FOLDER_NAME}/${subject}` })
  return result.entries.map(x => x.name)
  // } catch {

  // }
}

module.exports = { getChapters }