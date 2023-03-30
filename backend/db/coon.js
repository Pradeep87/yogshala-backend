const mongoose = require("mongoose");


const connectDatabase = () => {
  const uri = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.PASSWORD}@yogshalacluster.4shslk2.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`;
  mongoose.connect(uri, { useNewUrlParser: true, });
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error: "));
  db.once("open", function () {
    console.log("Connected successfully");
  });

}


module.exports = { connectDatabase };

