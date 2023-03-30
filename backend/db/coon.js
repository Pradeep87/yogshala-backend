const mongoose = require("mongoose");
const password = process.env.PASSWORD


const connectDatabase = () => {
  const uri = `mongodb+srv://Pradeep:${password}@yogshalacluster.4shslk2.mongodb.net/?retryWrites=true&w=majority`;
  mongoose.connect(uri,{useNewUrlParser: true,});
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error: "));
  db.once("open", function () {
    console.log("Connected successfully");
  });

}


module.exports = { connectDatabase };



// useFindAndModify: false,

// const mongoose = require("mongoose");

//   const connectDatabase = () => {
//   mongoose
//     .connect("mongodb://localhost:27017/yogshala", {
//       useNewUrlParser: true,
//     })
//     .then((data) => {
//       console.log(`mongodb connected with server ${data.connection.host}`);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// module.exports = { connectDatabase };
// .env example
