
const express = require("express")
require('dotenv').config();
const app = express()
const errorMiddelware=require('./middelwares/error')


const userRoutes = require("./routes/user")


app.use(express.json())
app.use("/api/user", userRoutes)



app.get("/", (req, res) => {
    res.send("hello server in running")
})


// middeleware for error
app.use(errorMiddelware);



module.exports = app