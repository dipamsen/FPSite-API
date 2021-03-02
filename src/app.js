const express = require("express")
const helmet = require("helmet")
const morgan = require("morgan")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(helmet())
app.use(morgan("short"))

module.exports = app