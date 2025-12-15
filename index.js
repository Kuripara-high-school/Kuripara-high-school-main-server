// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db/db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Server is running on 1.9!"));

connectDB().then((collections) => {
  const publicRoutes = require("./src/publicRoutes")(collections);
  const adminRoutes = require("./src/PublicData_Admin")(collections);
  const publicData = require("./src/adminRoutes")(collections);

  app.use(publicRoutes);
  app.use("/admin", publicData);
  app.use("/admin", adminRoutes);

  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
