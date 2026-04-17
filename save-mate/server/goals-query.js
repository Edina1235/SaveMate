const express = require("express");
const router = express.Router();

const db = require("./../firebase");
const authMiddleware = require("./authMiddleware");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const snapshot = await db.collection("goals").get();

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const snapshot = await db
      .collection("goals")
      .where("userId", "==",req.params.userId)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "Goals not found" });
    }

    const goals = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(goals);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const { id, ...dataWithoutId } = data;
    const docRef = await db.collection("goals").add(dataWithoutId);

    res.json({
      id: docRef.id,
      ...dataWithoutId
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const doc = await db
      .collection("goals")
      .doc(req.params.id)
      .get();

    if (!doc.exists) {
      return res.status(404).json({ message: "goal not found" });
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

    await db.collection("goals").doc(id).set(data, { merge: true });

    res.json({ message: "goal updated" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;

    await db.collection("goals").doc(id).delete();

    res.json({ message: "Goal deleted" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Delete failed" });
  }
});


module.exports = router;