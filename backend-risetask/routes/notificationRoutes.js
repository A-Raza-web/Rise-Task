import express from "express";
const router = express.Router();

// dummy example
router.get("/", (req, res) => {
  res.json([
    { id: 1, message: "Task due soon" },
    { id: 2, message: "New feature released!" }
  ]);
});

export default router;
