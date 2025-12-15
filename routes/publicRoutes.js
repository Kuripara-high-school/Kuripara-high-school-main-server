// routes/publicRoutes.js
const express = require("express");
const router = express.Router();

module.exports = (collections) => {
  const { Mail, Notice, Album, Link, Number, Visitor } = collections;

  // post mail into database 📼
  router.post("/post-mail", async (req, res) => {
    const AddMail = req.body;
    console.log(`the data is  ${AddMail}`);
    try {
      const result = await Mail.insertOne(AddMail);
      console.log(`the data is  ${result.insertedId}`);
      res.send(result);
    } catch (error) {
      console.error("The mail is not send to database", error);
      res.status(500).send({ massage: "Error is coming to insert data" });
    }
  });

  // get latest notice for client
  router.get("/latest-notice", async (req, res) => {
    try {
      // Limited data
      const result = await Notice.find({}).sort({ _id: -1 }).limit(5).toArray();
      // const result = await cursor.toArray();
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.send(result);
    } catch (error) {
      console.error("Error retrieving data:", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  });

  // get latest photo for client --
  router.get("/latest-album", async (req, res) => {
    try {
      // Limited data
      const result = await Album.find({}).sort({ _id: -1 }).limit(5).toArray();
      // const result = await cursor.toArray();
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.send(result);
    } catch (error) {
      console.error("Error retrieving data:", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  });

  // get All Notice
  router.get("/all-notice", async (req, res) => {
    try {
      const cursor = Notice.find();
      const result = await cursor.toArray();
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.send(result);
    } catch (error) {
      console.error("Error retrieving data:", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  });

  // get all photo
  router.get("/all-photo", async (req, res) => {
    try {
      const albumPhoto = Album.find();
      const result = await albumPhoto.toArray();
      res.send(result);
    } catch (error) {
      console.error("Error is coming for get album photo", error);
      res.status(500).send({ massage: "error is coming for get album data" });
    }
  });

  // get all school data (number)
  router.get("/all-number", async (req, res) => {
    try {
      const SchoolNum = Number.find();
      const result = await SchoolNum.toArray();
      res.send(result);
    } catch (error) {
      console.error("Error is coming for get album photo", error);
      res.status(500).send({ massage: "error is coming for get album data" });
    }
  });

  // the visitor data
  router.post("/api/track-visitor", async (req, res) => {
    const { ip, location } = req.body;
    const timestamp = new Date().toLocaleDateString("bn-BD", {
      timeZone: "Asia/Dhaka",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    });
    const UserLocation = location.country_name;
    const UserWifi = location.org;

    const data = { ip, UserLocation, UserWifi, timestamp };

    try {
      await Visitor.insertOne(data);

      res.status(200).json({ message: "Visitor tracked" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error saving data" });
    }
  });

  return router;
};
