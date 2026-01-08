const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// ================= DB CONNECT =================
mongoose.connect("mongodb://127.0.0.1:27017/hospital_db")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// ================= SCHEMAS =================

// Doctor
const doctorSchema = new mongoose.Schema({
  name: String,
  specialization: String,
  isActive: { type: Boolean, default: true }
});
const Doctor = mongoose.model("Doctor", doctorSchema);

// Patient
const patientSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  isActive: { type: Boolean, default: true }
});
const Patient = mongoose.model("Patient", patientSchema);

// Consultation (Junction)
const consultationSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  consultedAt: { type: Date, default: Date.now },
  notes: String,
  isActive: { type: Boolean, default: true }
});
const Consultation = mongoose.model("Consultation", consultationSchema);

// ================= APIs =================

// -------- Doctors --------
app.post("/doctors", async (req, res) => {
  const doctor = await Doctor.create(req.body);
  res.json(doctor);
});

app.delete("/doctors/:id", async (req, res) => {
  const { id } = req.params;

  await Doctor.findByIdAndUpdate(id, { isActive: false });
  await Consultation.updateMany({ doctorId: id }, { isActive: false });

  res.json({ message: "Doctor soft deleted with consultations" });
});

// -------- Patients --------
app.post("/patients", async (req, res) => {
  const patient = await Patient.create(req.body);
  res.json(patient);
});

app.delete("/patients/:id", async (req, res) => {
  const { id } = req.params;

  await Patient.findByIdAndUpdate(id, { isActive: false });
  await Consultation.updateMany({ patientId: id }, { isActive: false });

  res.json({ message: "Patient soft deleted with consultations" });
});

// -------- Consultations --------
app.post("/consultations", async (req, res) => {
  const { doctorId, patientId, notes } = req.body;

  const doctor = await Doctor.findOne({ _id: doctorId, isActive: true });
  const patient = await Patient.findOne({ _id: patientId, isActive: true });

  if (!doctor || !patient) {
    return res.status(400).json({ message: "Doctor or Patient inactive/not found" });
  }

  const consultation = await Consultation.create({ doctorId, patientId, notes });
  res.json(consultation);
});

// ================= READ OPERATIONS =================

// Doctor → Patients
app.get("/doctors/:id/patients", async (req, res) => {
  const data = await Consultation.find({
    doctorId: req.params.id,
    isActive: true
  })
    .populate({
      path: "patientId",
      select: "name age gender"
    })
    .sort({ consultedAt: -1 })
    .limit(10);

  const patients = data.map(c => c.patientId);
  res.json(patients);
});

// Patient → Doctors
app.get("/patients/:id/doctors", async (req, res) => {
  const data = await Consultation.find({
    patientId: req.params.id,
    isActive: true
  }).populate({
    path: "doctorId",
    select: "name specialization"
  });

  const doctors = data.map(c => c.doctorId);
  res.json(doctors);
});

// Doctor consultation count
app.get("/doctors/:id/consultations/count", async (req, res) => {
  const count = await Consultation.countDocuments({
    doctorId: req.params.id,
    isActive: true
  });

  res.json({ totalConsultations: count });
});

// Filter patients by gender
app.get("/patients", async (req, res) => {
  const { gender } = req.query;

  const patients = await Patient.find({
    gender,
    isActive: true
  });

  res.json(patients);
});

// Recent consultations
app.get("/consultations/recent", async (req, res) => {
  const consultations = await Consultation.find({ isActive: true })
    .sort({ consultedAt: -1 })
    .limit(5);

  res.json(consultations);
});

// ================= SERVER =================
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
