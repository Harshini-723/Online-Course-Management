import { Router } from "express";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import { protect, allow } from "../middleware/auth.js";
const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const filter = { published: true };
    if (req.query.search) filter.$or = [
      { title: { $regex: req.query.search, $options: "i" } },
      { category: { $regex: req.query.search, $options: "i" } }
    ];
    if (req.query.category && req.query.category !== "All") filter.category = req.query.category;
    const courses = await Course.find(filter).populate("instructor", "name").sort({ createdAt: -1 });
    res.json({ courses });
  } catch (e) { next(e); }
});
router.get("/mine/created", protect, allow("instructor", "admin"), async (req, res, next) => {
  try {
    const filter = req.user.role === "admin" ? {} : { instructor: req.user._id };
    res.json({ courses: await Course.find(filter).populate("instructor", "name").sort({ createdAt: -1 }) });
  } catch (e) { next(e); }
});
router.get("/:id", async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate("instructor", "name");
    if (!course || !course.published) return res.status(404).json({ message: "Course not found." });
    res.json({ course });
  } catch (e) { next(e); }
});
router.post("/", protect, allow("instructor", "admin"), async (req, res, next) => {
  try {
    const { title, subtitle, description, category, level, price, thumbnail, lessons } = req.body;
    if (!title?.trim()) return res.status(400).json({ message: "Course title is required." });
    const course = await Course.create({ title, subtitle, description, category, level, price, thumbnail, lessons: lessons || [], instructor: req.user._id });
    res.status(201).json({ course });
  } catch (e) { next(e); }
});
router.put("/:id", protect, allow("instructor", "admin"), async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found." });
    if (req.user.role !== "admin" && String(course.instructor) !== String(req.user._id))
      return res.status(403).json({ message: "You can only edit your own courses." });
    Object.assign(course, req.body);
    await course.save();
    res.json({ course });
  } catch (e) { next(e); }
});
router.delete("/:id", protect, allow("instructor", "admin"), async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found." });
    if (req.user.role !== "admin" && String(course.instructor) !== String(req.user._id))
      return res.status(403).json({ message: "You can only delete your own courses." });
    await Enrollment.deleteMany({ course: course._id });
    await course.deleteOne();
    res.json({ message: "Course deleted." });
  } catch (e) { next(e); }
});
export default router;
