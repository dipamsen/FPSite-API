const express = require("express")
const helmet = require("helmet")
const morgan = require("morgan")
const cors = require("cors")
const db = require("./database");
const filestore = require("./filestore");
const { getTextBook, getMathXplained, listFiles, getChaptersAndResources } = require("./files.drive");
const app = express()

app.use(cors())
app.use(helmet())
app.use(morgan("short"))

app.get("/", (req, res) => {
  res.send({
    message: "Hello, World!",
    url: "https://fun-planet-fpsite.vercel.app/"
  })
})
/**
 * @type {Record<import("./idnex").Subject, string>}
 */
const subjects = {
  eng: "English", hin: "Hindi", mat: "Maths", sci: "Science", ssc: "Social Science"
}


app.get("/subjects", (req, res) => {
  res.send({
    subjects
  })
})

app.get("/subjects/:subid", async (req, res) => {
  /** @type {{subid:import("./idnex").Subject}} */
  // @ts-ignore
  const { subid } = req.params
  const name = subjects[subid]
  const chapters = await filestore.getChapters(subid).catch(e => res.send(e))
  res.send({
    name, chapters
  })
})

app.get("/textbook", async (req, res) => {
  res.send(await getTextBook())
})

app.get("/mathxplained", async (req, res) => {
  res.send(await getMathXplained())
})

app.get("/test/:testID", async (req, res) => {
  const { testID } = req.params
  const test = await db.collection("tests").doc(testID).get()
  if (test.exists)
    res.json({
      id: test.id,
      ...test.data()
    })
  else res.status(404).json({
    status: "error",
    message: "test not found."
  })
})

app.get("/resources/:sub", async (req, res) => {
  const { sub } = req.params
  res.json(await getChaptersAndResources(sub))
})

module.exports = app