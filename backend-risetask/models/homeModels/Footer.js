import mongoose from "mongoose";

const footerSchema = new mongoose.Schema({
  company: { type: String, required: true },
  year: { type: Number, required: true },
  email: { type: String, required: true },
  socialLinks: {
    facebook: { type: String, default: "#" },
    twitter: { type: String, default: "#" },
    instagram: { type: String, default: "#" }
  }
});

export default mongoose.model("Footer", footerSchema);

