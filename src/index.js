const app = require("./app");
const db = require("./database");
const firebase = require("firebase");



const port = +process.env.PORT || 1930;
app.listen(port, () => console.log(`Listening on ${port}`));
