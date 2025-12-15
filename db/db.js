// db.js
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hesexcu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db("Kuripara-High-School");
    return {
      Mail: db.collection("Mail"),
      Notice: db.collection("Notice"),
      Album: db.collection("Album"),
      Link: db.collection("Link"),
      Number: db.collection("Number"),
      Auth: db.collection("Auth"),
      Visitor: db.collection("Visitor"),
      AdminAuth: db.collection("AdminAuth"),
    };
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}

module.exports = connectDB;
