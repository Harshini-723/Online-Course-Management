import { Router } from "express";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import { protect, allow } from "../middleware/auth.js";
const router = Router();
router.get("/stats", protect, allow("admin"), async (_req, res, next) => {
  try {
    const [users, courses, enrollments, students, instructors] = await Promise.all([
      User.countDocuments(), Course.countDocuments(), Enrollment.countDocuments(),
      User.countDocuments({ role: "student" }), User.countDocuments({ role: "instructor" })
    ]);
    res.json({ stats: { users, courses, enrollments, students, instructors } });
  } catch (e) { next(e); }
});
router.get("/users", protect, allow("admin"), async (_req, res, next) => {
  try { res.json({ users: await User.find().select("name email role createdAt").sort({ createdAt: -1 }) }); }
  catch (e) { next(e); }
});
router.patch("/users/:id/role", protect, allow("admin"), async (req, res, next) => {
  try {
    if (!["student", "instructor", "admin"].includes(req.body.role)) return res.status(400).json({ message: "Invalid role." });
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select("name email role");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ user });
  } catch (e) { next(e); }
});
export default router;
