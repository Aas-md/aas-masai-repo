const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// ================= DB CONNECT =================
mongoose.connect("mongodb://127.0.0.1:27017/m2m_db")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// ================= SCHEMAS =================

// Student Schema
const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  isActive: { type: Boolean, default: true }
});

const Student = mongoose.model("Student", studentSchema);

// Course Schema
const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  isActive: { type: Boolean, default: true }
});

const Course = mongoose.model("Course", courseSchema);

// Enrollment (Junction)
const enrollmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  enrolledAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

// ================= APIs =================

// -------- Students --------
app.post("/students", async (req, res) => {
  const student = await Student.create(req.body);
  res.json(student);
});

app.delete("/students/:id", async (req, res) => {
  const { id } = req.params;

  await Student.findByIdAndUpdate(id, { isActive: false });
  await Enrollment.updateMany({ studentId: id }, { isActive: false });

  res.json({ message: "Student soft deleted with enrollments" });
});

// -------- Courses --------
app.post("/courses", async (req, res) => {
  const course = await Course.create(req.body);
  res.json(course);
});

app.delete("/courses/:id", async (req, res) => {
  const { id } = req.params;

  await Course.findByIdAndUpdate(id, { isActive: false });
  await Enrollment.updateMany({ courseId: id }, { isActive: false });

  res.json({ message: "Course soft deleted with enrollments" });
});

// -------- Enrollment --------
app.post("/enroll", async (req, res) => {
  const { studentId, courseId } = req.body;

  const student = await Student.findOne({ _id: studentId, isActive: true });
  const course = await Course.findOne({ _id: courseId, isActive: true });

  if (!student || !course) {
    return res.status(400).json({ message: "Student or Course inactive/not found" });
  }

  const enrollment = await Enrollment.create({ studentId, courseId });
  res.json(enrollment);
});

// -------- List APIs --------

// Student → Courses
app.get("/students/:id/courses", async (req, res) => {
  const enrollments = await Enrollment.find({
    studentId: req.params.id,
    isActive: true
  }).populate("courseId");

  const courses = enrollments
    .filter(e => e.courseId.isActive)
    .map(e => e.courseId);

  res.json(courses);
});

// Course → Students
app.get("/courses/:id/students", async (req, res) => {
  const enrollments = await Enrollment.find({
    courseId: req.params.id,
    isActive: true
  }).populate("studentId");

  const students = enrollments
    .filter(e => e.studentId.isActive)
    .map(e => e.studentId);

  res.json(students);
});

// ================= SERVER =================
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
