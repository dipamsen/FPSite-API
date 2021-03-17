/**
 * @type {{
    subject: string;
    bookName: string;
    chapters: {
        name: string;
        index: number;
        link: string;
    }[];
  }[]}
 */
const { google } = require('googleapis');

const drive = google.drive({
  version: 'v3',
  auth: "AIzaSyD9qP4s_rkx4uV_Sex4KPzdaNErx_MSDJQ"
});
async function listFiles(folder) {
  const { data: files } = await drive.files.list({
    q: `"${folder}" in parents`, fields: "*"
  })
  return files
}

async function allSubjects() {
  const subjectFolders = await listFiles("1rw9ESBclwgbbQRTsBlHEQN8qAd8biVqg")
  return subjectFolders.files
}

async function getTextBook() {
  const textbook = []
  const subjects = await allSubjects()
  for (const file of subjects) {
    const [sub, bookName] = file.name.split("$$")
    const chapters = await listFiles(file.id)
    textbook.push({
      subject: sub, bookName,
      chapters: chapters.files.map(x => {
        const [, i, name] = x.name.slice(0, -4).match(/(\d+)\.\s+(.*)/)
        return {
          name,
          index: +i,
          link: x.webViewLink
        }
      }).sort((a, b) => a.index - b.index)
    })
  }
  return textbook
}

async function getMathXplained() {
  const mathxplainedFolder = "1gVG3YpiyQZ-Fut8a_V2OacSlaIeWneAj"
  const allFiles = await listFiles(mathxplainedFolder)
  /** @type {{questionLink?: string, answerLink?: string, chNo?: number, descriptor?: string}[]} */
  const MXData = []
  allFiles.files.map(file => {
    const [no, isSolution] = file.name.match(/math\-explained-(\d+)(\-solution)?.pdf/).slice(1, 3)
    return { no: +no, isSolution, file }
  }).map(({ no, isSolution, file }) => {
    if (!MXData[no]) MXData[no] = {}
    if (isSolution) MXData[no].answerLink = file.webViewLink
    else MXData[no].questionLink = file.webViewLink
    if (file.description) {
      const [, ch, topic, sec] = file.description.match(/CH(\d+)\-(.+)\-(.+)/)
      MXData[no].chNo = +ch
      MXData[no].descriptor = `${sec} ${topic}`
    }
  })
  return MXData
}


module.exports = { getTextBook, getMathXplained, listFiles }