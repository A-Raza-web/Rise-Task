// models/About.js
import mongoose from "mongoose";

const PointSchema = new mongoose.Schema({
  icon: { type: String, required: false },  // optional icon e.g. "FaCheckCircle"
  title: { type: String, required: true },  // e.g. "Smart Scheduling"
  description: { type: String, required: true } // e.g. "Organize tasks with priority & AI"
});

const AboutSchema = new mongoose.Schema({
  image: { type: String, required: true }, // e.g. "/images/about.jpg"
  heading: { type: String, required: true }, // e.g. "About RiseTask"
  description: { type: String, required: true }, // main paragraph text
  points: [PointSchema], // list of features
  button: {
    text: { type: String, required: true }, // e.g. "Learn More"
    link: { type: String, required: true }  // e.g. "/about"
  }
});

export default mongoose.model("About", AboutSchema);
