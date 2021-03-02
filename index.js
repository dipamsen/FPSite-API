const app = require("./src/app");
const db = require("./src/database");
const firebase = require("firebase");



const port = +process.env.PORT || 1930;
app.listen(port, () => console.log(`Listening on ${port}`));
