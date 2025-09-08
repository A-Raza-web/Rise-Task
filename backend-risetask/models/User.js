// userModel.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

// Virtual relation: User -> Settings
userSchema.virtual("settings", {
  ref: "Settings",        // kis model se relation banana hai
  localField: "_id",      // User model ka kaunsa field connect hoga
  foreignField: "user",   // Settings model me user ka reference field
  justOne: true           // ek user ki ek hi settings hogi
});

// JSON me virtuals ko include karne ke liye
userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

const User = mongoose.model("User", userSchema);
export default User;
