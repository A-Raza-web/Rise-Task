import mongoose from "mongoose";

const PricingSchema = new mongoose.Schema({
  title: { type: String, required: true },       // Free / Pro / Enterprise
  price: { type: Number, required: true },       // 0, 9, 29
  duration: { type: String, default: "/month" }, // /month, /year
  features: [{ type: String }],                  // ["Up to 10 tasks", "Basic features"]
  popular: { type: Boolean, default: false },    // Highlight badge
  buttonText: { type: String, required: true },  // e.g., "Get Started"
});

export default mongoose.model("Pricing", PricingSchema);
