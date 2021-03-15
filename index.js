const app = require("./src/app");
require("dotenv").config()

const port = +process.env.PORT || 1930;
app.listen(port, () => console.log(`Listening on ${port}`));
