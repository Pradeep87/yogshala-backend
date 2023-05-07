const express = require("express");
require("dotenv").config();
const app = express();
const errorMiddelware = require("./middelwares/error");
const cookieParser = require("cookie-parser");
const bodyparser = require("body-parser");
const fileUpload = require("express-fileupload");
const Pusher = require('pusher');

const Comment=require("./models/comments")


const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const healthIssueRoutes = require("./routes/healthIssue");
const treatmentPlan = require("./routes/treatmentPlan");
const common = require("./routes/common");

const pusher = new Pusher({
  appId: "1590103",
  key: "c76ab183f64f0a3749ca",
  secret: "fd5b4c8d38e2e55ad11a",
  cluster: "ap2",
  useTLS: true
});

app.set('pusher', pusher);


app.use(cookieParser());
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(fileUpload());

app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/healthissue", healthIssueRoutes);
app.use("/api/treatmentPlan", treatmentPlan);
app.use("/api/user", common);

const changeStream = Comment.watch()
changeStream.on('change', (event) => {
  console.log(event)
// your logic
})



app.get("/", (req, res) => {
  res.send("hello server in running");
});

// middeleware for error
app.use(errorMiddelware);

module.exports = app;
``