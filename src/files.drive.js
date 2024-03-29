const { google } = require("googleapis");

const drive = google.drive({
  version: "v3",
  auth: process.env.GOOGLE_KEY,
});
async function listFiles(folder) {
  const { data: files } = await drive.files.list({
    q: `"${folder}" in parents`,
    fields: "files/description, files/name, files/id, files/mimeType",
  });
  return files;
}

async function allSubjects() {
  const subjectFolders = await listFiles("1rw9ESBclwgbbQRTsBlHEQN8qAd8biVqg");
  return subjectFolders.files.map((x, i) => {
    const [subject, bookName] = x.name.split("$$");
    return {
      subject,
      bookName,
      id: x.id,
      idx: i,
    };
  });
}

/**
 * @param {import("googleapis").drive_v3.Schema$File} id
 */
function webViewLink(id) {
  return id.mimeType == "application/vnd.google-apps.folder"
    ? `https://drive.google.com/drive/folders/${id.id}`
    : `https://drive.google.com/file/d/${id.id}/view`;
}

async function getTextBook(idx) {
  const subjects = await allSubjects();
  const folder = subjects[idx];
  const chapters = await listFiles(folder.id);
  return {
    subject: folder.subject,
    bookName: folder.bookName,
    chapters: chapters.files
      .map((x) => {
        const [, i, name] = x.name.slice(0, -4).match(/(\d+)\.\s+(.*)/);
        return {
          name,
          index: +i,
          link: webViewLink(x),
        };
      })
      .sort((a, b) => a.index - b.index),
  };
}

async function getMathXplained() {
  const mathxplainedFolder = "1gVG3YpiyQZ-Fut8a_V2OacSlaIeWneAj";
  const allFiles = await listFiles(mathxplainedFolder);
  /** @type {{questionLink?: string, answerLink?: string, chNo?: number, descriptor?: string}[]} */
  const MXData = [];
  allFiles.files
    .map((file) => {
      const [no, isSolution] = file.name
        .match(/math\-explained-(\d+)(\-solution)?.pdf/)
        .slice(1, 3);
      return { no: +no, isSolution, file };
    })
    .map(({ no, isSolution, file }) => {
      if (!MXData[no]) MXData[no] = {};
      if (isSolution) MXData[no].answerLink = file.webViewLink;
      else MXData[no].questionLink = file.webViewLink;
      if (file.description) {
        const [, ch, topic, sec] = file.description.match(
          /CH(\d+)\-(.+)\-(.+)/
        );
        MXData[no].chNo = +ch;
        MXData[no].descriptor = `${sec} ${topic}`;
      }
    });
  return MXData;
}

/**
 * @param {string} string
 */
function parseData(string = "") {
  const keyvals = string.split("\n").map((x) => x.split("="));
  // @ts-ignore
  return new Map(keyvals);
}

function bool(str) {
  return str == "true";
}

async function getChaptersAndResources(subID) {
  const byOrderID = (a, b) => a._orderID - b._orderID;
  const removeOrderID = (x) => {
    const { _orderID, ...rest } = x;
    return rest;
  };
  const subToID = {
    eng: "1_EKb_2R_b_xfk31uV4TRLLFLwqXZDDmT",
    hin: "1UcQhrPBVE14V4z9grpb0OFshEFASxyTL",
    mat: "1Ic-5rT3wsmqSOlERqEemYj53drbUKPqV",
    sci: "1VUTmZGx2LDAkBkCZrOLB3HnHbcceS9il",
    ssc: "1mHbiZ81aMCvGzxV5AeO8u5g9bu_7-Roy",
  };
  if (!subToID[subID]) return { error: "bruh" };
  const chapters = await listFiles(subToID[subID]);
  const allChapters = [];
  for (const chapter of chapters.files) {
    const resources = await listFiles(chapter.id);
    if (resources.files.length == 0) continue;
    const allResources = [];
    for (const resource of resources.files) {
      const config = parseData(resource.description);
      if (bool(config.get("IGNORE"))) continue;
      const hasSolution =
        bool(config.get("HAS_SOLUTION")) || !!config.get("ANSWER_FILE");
      const answerFile = resources.files.find((f) =>
        f.name.startsWith(config.get("ANSWER_FILE"))
      );
      if (answerFile && answerFile.description)
        answerFile.description += "\nIGNORE=true";
      allResources.push({
        name: config.get("NAME") || resource.name,
        link: webViewLink(resource),
        hasSolution,
        _orderID: config.get("ORDERID"),
        answerLink: hasSolution ? webViewLink(answerFile) : undefined,
      });
    }
    allChapters.push({
      chapterName: chapter.name,
      _orderID: +chapter.description,
      resources: allResources.sort(byOrderID).map(removeOrderID),
    });
  }
  return allChapters.sort(byOrderID).map(removeOrderID);
}

module.exports = {
  getTextBook,
  listFiles,
  getChaptersAndResources,
  allSubjects,
};
