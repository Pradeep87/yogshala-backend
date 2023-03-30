const mongoose = require("mongoose");

const connectDatabase = () => {
    const uri = "mongodb+srv://Pradeep:DXFpHCF0SPnlzGxb@yogshalacluster.4shslk2.mongodb.net/?retryWrites=true&w=majority";
    mongoose.connect(uri,
        {
            useNewUrlParser: true,
          useUnifiedTopology: true
        }
      );
    
    
      const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error: "));
    db.once("open", function () {
      console.log("Connected successfully");
    });

}


module.exports = { connectDatabase };



// useFindAndModify: false,

// DXFpHCF0SPnlzGxb  




