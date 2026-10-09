// routes/adminRoutes.js
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();

module.exports = (collections) => {
  const { Auth, Notice, Album, Link, Number, Visitor } = collections;

  // Admin Authentication 🔓

  // ------------------------- admin statistic number -----------------
  // Get Visitor data (number)
  router.get("/visitor-number", async (req, res) => {
    try {
      const SchoolNum = await Visitor.find().toArray();
      const result = SchoolNum.length;
      res.send(result);
    } catch (error) {
      console.error("Error is coming for get album photo", error);
      res.status(500).send({ massage: "error is coming for get visitor data" });
    }
  });

  // Get Notice data (number)
  router.get("/notice-number", async (req, res) => {
    try {
      const NoticeNum = await Notice.find().toArray();
      const result = NoticeNum.length;
      res.send(result);
    } catch (error) {
      console.error("Error is coming for get album photo", error);
      res.status(500).send({ massage: "error is coming for get album data" });
    }
  });

  // Get Album data (number)
  router.get("/album-number", async (req, res) => {
    try {
      const AlbumNum = await Album.find().toArray();
      const result = AlbumNum.length;
      res.send(result);
    } catch (error) {
      console.error("Error is coming for get album photo", error);
      res.status(500).send({ massage: "error is coming for get album data" });
    }
  });

  // ---- letest data -------

    // get All Notice
  router.get("/get-all-notice", async (req, res) => {
    try {

      // Query the database get all notice data
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
  router.get("/all-event", async (req, res) => {
    try {

      // Query the database get all event
      const albumPhoto = Album.find();
      const result = await albumPhoto.toArray();

      res.send(result);
    } catch (error) {
      console.error("Error is coming for get album photo", error);
      res.status(500).send({ massage: "error is coming for get album data" });
    }
  });

  // --------------------- get large data ---------------

  return router;
};
