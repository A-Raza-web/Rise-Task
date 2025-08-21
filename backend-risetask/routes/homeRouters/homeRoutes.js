import  express from "express" ;
const router = express.Router();
import  Home  from  "../../models/homeModels/Home.js";

// POST route - Save new home data
router.post("/", async (req, res) => {
  try {
    const home = new Home(req.body);
    await home.save();
    res.status(201).json({ message: "Home data saved successfully", home });
  } catch (error) {
    res.status(500).json({ message: "Error saving home data", error: error.message });
  }
});

// GET route - Fetch home data (latest one)
router.get("/", async (req, res) => {
  try {
    const home = await Home.findOne().sort({ _id: -1 }); // latest data
    if (!home) return res.status(404).json({ message: "No home data found" });
    res.json(home);
  } catch (error) {
    res.status(500).json({ message: "Error fetching home data", error: error.message });
  }
});

export default router;
