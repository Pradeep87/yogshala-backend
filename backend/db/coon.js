const mongoose = require("mongoose");

// const connectDatabase = () => {
//   const uri = "mongodb+srv://Pradeep:DXFpHCF0SPnlzGxb@yogshalacluster.4shslk2.mongodb.net/?retryWrites=true&w=majority";
//   const uri2= 'mongodb://127.0.0.1:27017/myapp'
//   mongoose.connect(uri2,
//     {
//       useNewUrlParser: true,
//     }
//   );


//   const db = mongoose.connection;
//   db.on("error", console.error.bind(console, "connection error: "));
//   db.once("open", function () {
//     console.log("Connected successfully");
//   });

// }


// module.exports = { connectDatabase };



// useFindAndModify: false,

// DXFpHCF0SPnlzGxb  



// const mongoose = require("mongoose");

  const connectDatabase = () => {
  mongoose
    .connect("mongodb://localhost:27017/yogshala", {
      useNewUrlParser: true,
    })
    .then((data) => {
      console.log(`mongodb connected with server ${data.connection.host}`);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = { connectDatabase };

