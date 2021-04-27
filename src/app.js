const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const db = require("./database");
const filestore = require("./filestore");
const {
  Temporal: { PlainDate },
} = require("proposal-temporal");

const {
  getTextBook,
  listFiles,
  getChaptersAndResources,
  allSubjects,
} = require("./files.drive");
const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("short"));

app.get("/", (req, res) => {
  res.send({
    message: "Hello, World!",
    url: "https://fun-planet-fpsite.vercel.app/",
  });
});
/**
 * @type {Record<import("./idnex").Subject, string>}
 */
const subjects = {
  eng: "English",
  hin: "Hindi",
  mat: "Maths",
  sci: "Science",
  ssc: "Social Science",
};

app.get("/subjects", (req, res) => {
  res.send({
    subjects,
  });
});

app.get("/subjects/:subid", async (req, res) => {
  /** @type {{subid:import("./idnex").Subject}} */
  // @ts-ignore
  const { subid } = req.params;
  const name = subjects[subid];
  const chapters = await filestore.getChapters(subid).catch((e) => res.send(e));
  res.send({
    name,
    chapters,
  });
});

app.get("/textbook", async (req, res) => {
  res.send(await allSubjects());
});

app.get("/textbook/:idx", async (req, res) => {
  const { idx } = req.params;
  res.send(await getTextBook(+idx));
});

// app.get("/mathxplained", async (req, res) => {
//   res.send(await getMathXplained());
// });

app.get("/test/:testID", async (req, res) => {
  const { testID } = req.params;
  const test = await db.collection("tests").doc(testID).get();
  if (test.exists)
    res.json({
      id: test.id,
      ...test.data(),
    });
  else
    res.status(404).json({
      status: "error",
      message: "test not found.",
    });
});

app.get("/calendar", async (req, res) => {
  const collection = await db.collection("calendar").get();
  console.log(collection);
  /** @type {import("./idnex").CalendarEvent[]} */
  // @ts-ignore
  const data = collection.docs.map((z) => z.data());
  console.log(data);
  res.json(
    data.map((d) => {
      const { name, description } = d;
      const dates = [];
      if (d.type == "vacation") {
        const start = PlainDate.from(d.startDate.toDate().toISOString());
        const end = PlainDate.from(d.endDate.toDate().toISOString());
        for (
          let curr = start;
          PlainDate.compare(curr, end) !== 1;
          curr = curr.add({ days: 1 })
        )
          dates.push(curr.toString());
      } else {
        const date = PlainDate.from(d.date.toDate().toISOString()).toString();
        dates.push(date);
      }
      return {
        name,
        type: d.type == "vacation" ? "holiday" : d.type,
        description,
        dates,
      };
    })
  );
});

app.post("/calendar", async (req, res) => {
  /** @type {import("./idnex").CalendarEvent} */
  const body = req.body;
  try {
    const doc = await db.collection("calendar").add(body);
    res.send({ success: true });
  } catch (err) {
    res.status(503).send({ success: false, err });
  }
});

app.get("/resources/:sub", async (req, res) => {
  const { sub } = req.params;
  res.json(await getChaptersAndResources(sub));
});

module.exports = app;
