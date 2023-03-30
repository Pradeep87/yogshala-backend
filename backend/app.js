
const express = require("express")
require('dotenv').config();
const app = express()
const errorMiddelware=require('./middelwares/error')
const cookieParser=require('cookie-parser');
const bodyparser=require('body-parser');
const fileUpload = require("express-fileupload");

const userRoutes = require("./routes/user")

app.use(cookieParser());
app.use(express.json())
app.use(bodyparser.urlencoded({ extended: true }));
app.use(fileUpload());



app.use("/api/user", userRoutes)



app.get("/", (req, res) => {
    res.send("hello server in running")
})


// middeleware for error
app.use(errorMiddelware);



module.exports = app