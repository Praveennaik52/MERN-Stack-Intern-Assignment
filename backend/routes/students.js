import express from "express";
import Student from "../models/Student.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// --------------------
// Admin Routes
// --------------------

// Get all students (admin only)
router.get("/", protect, authorize("admin"), async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});

// Add a new student (admin only)
router.post("/", protect, authorize("admin"), async (req, res) => {
    const { name, email, course, enrollmentDate } = req.body;

    try {
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ msg: "Student already exists" });
        }

        const student = await Student.create({ name, email, course, enrollmentDate });
        res.json(student);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});

// Update a student (admin only)
router.put("/:id", protect, authorize("admin"), async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!student) return res.status(404).json({ msg: "Student not found" });
        res.json(student);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});

// Delete a student (admin only)
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).json({ msg: "Student not found" });
        res.json({ msg: "Student deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});

// --------------------
// Student Routes
// --------------------

// Get own profile (student only)
router.get("/me", protect, authorize("student"), async (req, res) => {
    try {
        const student = await Student.findOne({ email: req.user.email });
        if (!student) return res.status(404).json({ msg: "Student not found" });
        res.json(student);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});

// Update own profile (student only)
router.put("/me", protect, authorize("student"), async (req, res) => {
    try {
        const student = await Student.findOneAndUpdate({ email: req.user.email }, req.body, { new: true });
        if (!student) return res.status(404).json({ msg: "Student not found" });
        res.json(student);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});

export default router;
