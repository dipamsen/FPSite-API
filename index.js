const express = require("express")
const helmet = require("helmet")
const morgan = require("morgan")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(helmet())
app.use(morgan("short"))

const port = +process.env.PORT || 1930
app.listen(port, () => console.log(`Listening on ${port}`))
