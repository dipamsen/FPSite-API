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
let textbook = []
const { google } = require('googleapis');

const drive = google.drive({
  version: 'v3',
  auth: "AIzaSyD9qP4s_rkx4uV_Sex4KPzdaNErx_MSDJQ"
});
async function listFiles(folder) {
  const { data: files } = await drive.files.list({
    q: `"${folder}" in parents`
  })
  return files
}

function getLinkFromId(id) {
  return `https://drive.google.com/file/d/${id}/view`
}

async function allSubjects() {
  const subjectFolders = await listFiles("1rw9ESBclwgbbQRTsBlHEQN8qAd8biVqg")
  if (textbook.length == subjectFolders.files.length) return textbook
  textbook = []
  for (const file of subjectFolders.files) {
    const [sub, bookName] = file.name.split("$$")
    const chapters = await listFiles(file.id)
    textbook.push({
      subject: sub, bookName,
      chapters: chapters.files.map(x => {
        const [, i, name] = x.name.slice(0, -4).match(/(\d+)\.\s+(.*)/)
        return {
          name,
          index: +i,
          link: getLinkFromId(x.id)
        }
      }).sort((a, b) => a.index - b.index)
    })
  }
  return textbook
}

async function getTextBook() {
  return allSubjects()
}


module.exports = { getTextBook }