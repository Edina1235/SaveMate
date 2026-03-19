const express = require("express");
const router = express.Router();

const db = require("../firebase");
const authMiddleware = require("./authMiddleware");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const snapshot = await db.collection("contactMessages").get();

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const docRef = await db.collection("contactMessages").add(data);

    res.json({
      id: docRef.id,
      ...data
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const doc = await db
      .collection("contactMessages")
      .doc(req.params.id)
      .get();

    if (!doc.exists) {
      return res.status(404).json({ message: "contactMessage not found" });
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

    await db.collection("contactMessages").doc(id).set(data, { merge: true });

    res.json({ message: "contactMessage updated" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;

    await db.collection("contactMessages").doc(id).delete();

    res.json({ message: "ContactMessage deleted" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Delete failed" });
  }
});


module.exports = router;