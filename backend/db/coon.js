
const { MongoClient, ServerApiVersion } = require('mongodb');




const connectDatabase = () => {
    const uri = "mongodb+srv://Pradeep:DXFpHCF0SPnlzGxb@yogshalacluster.4shslk2.mongodb.net/?retryWrites=true&w=majority";

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    client.connect(err => {
        console.log(err)
        const collection = client.db("test").collection("devices");
        client.close();
    });
    console.log("mongodb:: connected")
}


module.exports = { connectDatabase };



//

// DXFpHCF0SPnlzGxb  