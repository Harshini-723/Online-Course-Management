import { Router } from "express";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import { protect } from "../middleware/auth.js";
const router = Router();

router.get("/mine", protect, async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id }).populate({
      path: "course", populate: { path: "instructor", select: "name" }
    }).sort({ enrolledAt: -1 });
    res.json({ enrollments });
  } catch (e) { next(e); }
});
router.post("/:courseId", protect, async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course || !course.published) return res.status(404).json({ message: "Course not found." });
    const enrollment = await Enrollment.findOneAndUpdate(
      { student: req.user._id, course: course._id },
      { $setOnInsert: { student: req.user._id, course: course._id } },
      { upsert: true, new: true }
    );
    res.status(201).json({ enrollment, message: "You are enrolled!" });
  } catch (e) { next(e); }
});
router.patch("/:id/lessons/:lessonId", protect, async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findOne({ _id: req.params.id, student: req.user._id });
    if (!enrollment) return res.status(404).json({ message: "Enrollment not found." });
    const lessonExists = await Course.exists({ _id: enrollment.course, "lessons._id": req.params.lessonId });
    if (!lessonExists) return res.status(404).json({ message: "Lesson not found." });
    const exists = enrollment.completedLessons.some(id => String(id) === req.params.lessonId);
    if (!exists) enrollment.completedLessons.push(req.params.lessonId);
    await enrollment.save();
    res.json({ enrollment });
  } catch (e) { next(e); }
});
export default router;
