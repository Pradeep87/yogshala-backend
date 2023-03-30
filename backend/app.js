
const express = require("express")
require('dotenv').config();
const app = express()


const userRoutes = require("./routes/user")

app.use("/api/user", userRoutes)



app.get("/", (req, res) => {
    res.send("hello server in running")
})

module.exports = app