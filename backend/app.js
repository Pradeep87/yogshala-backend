const express = require("express");
require("dotenv").config();
const app = express();
const errorMiddelware = require("./middelwares/error");
const cookieParser = require("cookie-parser");
const bodyparser = require("body-parser");
const fileUpload = require("express-fileupload");

const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const healthIssueRoutes = require("./routes/healthIssue");
const treatmentPlan = require("./routes/treatmentPlan");
const common = require("./routes/common");

app.use(cookieParser());
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(fileUpload());

app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/healthissue", healthIssueRoutes);
app.use("/api/treatmentPlan", treatmentPlan);
app.use("/api/user", common);

app.get("/", (req, res) => {
  res.send("hello server in running");
});

// middeleware for error
app.use(errorMiddelware);

module.exports = app;
