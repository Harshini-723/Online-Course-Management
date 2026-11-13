import mongoose from "mongoose";
const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  videoUrl: { type: String, default: "" },
  duration: { type: String, default: "10 min" }
});
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  subtitle: { type: String, default: "" },
  description: { type: String, default: "" },
  category: { type: String, default: "General" },
  level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
  price: { type: Number, default: 0, min: 0 },
  thumbnail: { type: String, default: "" },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lessons: [lessonSchema],
  published: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.model("Course", courseSchema);
