const express = require("express");
const router = express.Router();

const db = require("../firebase");
const authMiddleware = require("./authMiddleware");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();

    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(users);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const user = req.body;
    console.log(user);
    const docRef = await db.collection("users").doc(user.id).set(user);

    res.json({
      id: docRef.id,
      ...user
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const doc = await db
      .collection("users")
      .doc(req.params.id)
      .get();

    if (!doc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: doc.id,
      ...doc.data()
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    await db.collection("users").doc(id).set(data, { merge: true });

    res.json({ message: "User updated" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;

    await db.collection("users").doc(id).delete();

    res.json({ message: "User deleted" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;