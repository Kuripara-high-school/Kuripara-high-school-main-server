// routes/adminRoutes.js
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const { ObjectId } = require("mongodb");
const app = express();

app.use(express.json());

module.exports = (collections) => {
  const { Auth, Notice, Album, Link, Number, Visitor } = collections;

  // private routes
  function verifyAdmin(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader)
      return res.status(403).send({ message: "⚠️ No token provided" });

    const token = authHeader.split(" ")[1]; // "Bearer TOKEN"

    jwt.verify(
      token,
      process.env.JWT_SECRET || "secret_key",
      (err, decoded) => {
        if (err) return res.status(401).send({ message: "❌ Unauthorized" });

        if (decoded.role !== "admin") {
          return res
            .status(403)
            .send({ message: "❌ Only admin can access this route" });
        }

        req.user = decoded;
        next();
      },
    );
  }

  // Admin Authentication 🔓
  router.post("/auth", async (req, res) => {
    try {
      const user = await Auth.findOne({ name: req.body.name });
      if (!user) return res.status(404).send("❌ User not found!");
      //   console.log(user);

      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password,
      );
      if (!validPassword)
        return res.status(401).send("❌ Invalid credentials!");

      const token = jwt.sign({ id: user._id, role: "admin" }, "secret_key", {
        expiresIn: "3h",
      });
      res.status(200).send({ token });
    } catch (error) {
      res.status(500).send("❌ Login Error: " + error.message);
    }
  });

  // update password
  // update password route
  router.put("/update-password", async (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
      return res
        .status(400)
        .send({ message: "❌ Name and Password is require" });
    }

    try {
      // Finding the user
      const user = await Auth.findOne({ name });

      if (!user) {
        return res.status(404).send({ message: "❌ user is not found" });
      }

      // password is convert into has
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const result = await Auth.updateOne(
        { name },
        { $set: { password: hashedPassword } },
      );

      if (result.modifiedCount > 0) {
        res.status(200).send({ message: "✅ password is update!" });
      } else {
        res.status(500).send({ message: "❌ something is wrong" });
      }
    } catch (error) {
      console.error("Update Password Error:", error);
      res.status(500).send({ message: "❌ server error" });
    }
  });

  // post notice into database 📼
  router.post("/post-notice", verifyAdmin, async (req, res) => {
    const AddNotice = req.body;
    console.log(AddNotice);
    try {
      const result = await Notice.insertOne(AddNotice);
      console.log(result.insertedId);
      res.send(result);
    } catch (error) {
      console.error("the Notice is not send to database", error);
      res.status(500).send({ massage: "error is coming to insert data" });
    }
  });

  // post Event data
  router.post("/post-album", verifyAdmin, async (req, res) => {
    const AddAlbum = req.body;
    console.log(AddAlbum);
    try {
      const result = await Album.insertOne(AddAlbum);
      console.log(result.insertedId);
      res.send(result);
    } catch (error) {
      console.error("the Album is not send to database", error);
      res.status(500).send({ massage: "error is coming to insert data" });
    }
  });

  // add social link
  router.post("/post-link", verifyAdmin, async (req, res) => {
    const AddLink = req.body;
    console.log(AddLink);
    try {
      const result = await Link.insertOne(AddLink);
      console.log(result.insertedId);
      res.send(result);
    } catch (error) {
      console.error("the Album is not send to database", error);
      res.status(500).send({ massage: "error is coming to insert data" });
    }
  });

  // add school number data
  router.post("/post-number", verifyAdmin, async (req, res) => {
    const AddLink = req.body;
    console.log(AddLink);
    try {
      const result = await Number.insertOne(AddLink);
      console.log(result.insertedId);
      res.send(result);
    } catch (error) {
      console.error("the Album is not send to database", error);
      res.status(500).send({ massage: "error is coming to insert data" });
    }
  });

  // update event data
  router.put("/update-event", verifyAdmin, async (req, res) => {
    const { IdData, Title, Description, Photo, Data } = req.body;

    if (!IdData) return res.status(400).send("❌ Id is not coming");

    try {
      const result = await Album.updateOne(
        { _id: new ObjectId(IdData) },
        {
          $set: {
            Title,
            Description,
            Photo,
            Data,
          },
        },
      );

      if (result.modifiedCount > 0) {
        res.status(200).send({ message: "✅ update is successful" });
      } else {
        res.status(404).send({ message: "❌ ID is not find" });
      }
    } catch (error) {
      console.error("Update Error:", error);
      res.status(500).send({ message: "❌ server error 500 " });
    }
  });

  // handel delete event 📛
  router.delete("/delete-event/:id", verifyAdmin, async (req, res) => {
    const { id } = req.params;

    if (!id) return res.status(400).send({ message: "❌ ID not provided" });

    try {
      const result = await Album.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount > 0) {
        res.status(200).send({ message: "✅ Event deleted successfully" });
      } else {
        res.status(404).send({ message: "❌ Event not found" });
      }
    } catch (error) {
      console.error("Delete Error:", error);
      res.status(500).send({ message: "❌ Server error" });
    }
  });

  // --------- notice editing

  // update Notice data
  router.put("/update-notice", verifyAdmin, async (req, res) => {
    const { IdData, Title, Photo, Data, ShortDescription, LongDescription } =
      req.body;

    if (!IdData) return res.status(400).send("❌ Id is not coming");

    try {
      const result = await Notice.updateOne(
        { _id: new ObjectId(IdData) },
        {
          $set: {
            Title,
            ShortDescription,
            LongDescription,
            Photo,
            Data,
          },
        },
      );

      if (result.modifiedCount > 0) {
        res.status(200).send({ message: "✅ update is successful" });
      } else {
        res.status(404).send({ message: "❌ ID is not find" });
      }
    } catch (error) {
      console.error("Update Error:", error);
      res.status(500).send({ message: "❌ server error 500 " });
    }
  });

  // handel delete Notice 📛
  router.delete("/delete-notice/:id", verifyAdmin, async (req, res) => {
    const { id } = req.params;

    if (!id) return res.status(400).send({ message: "❌ ID not provided" });

    try {
      const result = await Notice.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount > 0) {
        res.status(200).send({ message: "✅ Event deleted successfully" });
      } else {
        res.status(404).send({ message: "❌ Event not found" });
      }
    } catch (error) {
      console.error("Delete Error:", error);
      res.status(500).send({ message: "❌ Server error" });
    }
  });

  return router;
};
