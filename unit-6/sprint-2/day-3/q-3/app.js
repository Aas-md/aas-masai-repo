const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// ================= DB CONNECT =================
mongoose.connect("mongodb://127.0.0.1:27017/mentorhub_db")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// ================= SCHEMAS =================

// Mentor
const mentorSchema = new mongoose.Schema({
  name: String,
  expertise: String,
  isActive: { type: Boolean, default: true }
});
const Mentor = mongoose.model("Mentor", mentorSchema);

// Learner
const learnerSchema = new mongoose.Schema({
  name: String,
  field: String,
  isActive: { type: Boolean, default: true }
});
const Learner = mongoose.model("Learner", learnerSchema);

// Session (Junction + Metadata)
const sessionSchema = new mongoose.Schema({
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor" },
  learners: [
    {
      learnerId: { type: mongoose.Schema.Types.ObjectId, ref: "Learner" },
      attendanceStatus: { type: String, default: "attended" } // attended | cancelled
    }
  ],
  topic: String,
  scheduledAt: Date,
  notes: String,
  isActive: { type: Boolean, default: true },
  isArchived: { type: Boolean, default: false }
});
const Session = mongoose.model("Session", sessionSchema);

// ================= APIs =================

// -------- Mentor & Learner --------
app.post("/mentors", async (req, res) => {
  const mentor = await Mentor.create(req.body);
  res.json(mentor);
});

app.post("/learners", async (req, res) => {
  const learner = await Learner.create(req.body);
  res.json(learner);
});

// -------- Create Session --------
app.post("/sessions", async (req, res) => {
  const { mentorId, learners, topic, scheduledAt, notes } = req.body;

  const mentor = await Mentor.findOne({ _id: mentorId, isActive: true });
  if (!mentor) return res.status(400).json({ message: "Mentor inactive/not found" });

  const session = await Session.create({
    mentorId,
    learners,
    topic,
    scheduledAt,
    notes
  });

  res.json(session);
});

// ================= READ OPERATIONS =================

// Active sessions for mentor
app.get("/mentors/:id/sessions", async (req, res) => {
  const sessions = await Session.find({
    mentorId: req.params.id,
    isActive: true,
    isArchived: false
  }).sort({ scheduledAt: -1 });

  res.json(sessions);
});

// Active sessions for learner
app.get("/learners/:id/sessions", async (req, res) => {
  const sessions = await Session.find({
    "learners.learnerId": req.params.id,
    isActive: true,
    isArchived: false
  });

  res.json(sessions);
});

// Recent sessions
app.get("/sessions/recent", async (req, res) => {
  const sessions = await Session.find({ isActive: true, isArchived: false })
    .sort({ scheduledAt: -1 })
    .limit(5);

  res.json(sessions);
});

// Count learners attended mentor sessions
app.get("/mentors/:id/learners/count", async (req, res) => {
  const sessions = await Session.find({
    mentorId: req.params.id,
    isActive: true
  });

  const learnerSet = new Set();
  sessions.forEach(s =>
    s.learners.forEach(l => {
      if (l.attendanceStatus === "attended") learnerSet.add(l.learnerId.toString());
    })
  );

  res.json({ totalLearners: learnerSet.size });
});

// Mentors interacted by learner
app.get("/learners/:id/mentors", async (req, res) => {
  const sessions = await Session.find({
    "learners.learnerId": req.params.id
  }).populate("mentorId", "name expertise");

  const mentors = sessions.map(s => s.mentorId);
  res.json(mentors);
});

// Learners of a session
app.get("/sessions/:id/learners", async (req, res) => {
  const session = await Session.findById(req.params.id)
    .populate("learners.learnerId", "name field");

  res.json(session.learners);
});

// Mentors with no active sessions
app.get("/mentors/no-active-sessions", async (req, res) => {
  const mentors = await Mentor.find({ isActive: true });
  const sessions = await Session.find({ isActive: true, isArchived: false });

  const activeMentorIds = new Set(sessions.map(s => s.mentorId.toString()));
  const result = mentors.filter(m => !activeMentorIds.has(m._id.toString()));

  res.json(result);
});

// Learners attended more than 3 sessions
app.get("/learners/frequent", async (req, res) => {
  const sessions = await Session.find({ isActive: true });

  const countMap = {};
  sessions.forEach(s =>
    s.learners.forEach(l => {
      if (l.attendanceStatus === "attended") {
        countMap[l.learnerId] = (countMap[l.learnerId] || 0) + 1;
      }
    })
  );

  const learnerIds = Object.keys(countMap).filter(id => countMap[id] > 3);
  const learners = await Learner.find({ _id: { $in: learnerIds } });

  res.json(learners);
});

// ================= SOFT DELETE & ARCHIVE =================

// Delete Mentor → Disable sessions
app.delete("/mentors/:id", async (req, res) => {
  await Mentor.findByIdAndUpdate(req.params.id, { isActive: false });
  await Session.updateMany(
    { mentorId: req.params.id },
    { isActive: false }
  );

  res.json({ message: "Mentor soft deleted & sessions disabled" });
});

// Delete Learner → Cancel attendance
app.delete("/learners/:id", async (req, res) => {
  await Learner.findByIdAndUpdate(req.params.id, { isActive: false });
  await Session.updateMany(
    { "learners.learnerId": req.params.id },
    { $set: { "learners.$.attendanceStatus": "cancelled" } }
  );

  res.json({ message: "Learner soft deleted & attendance cancelled" });
});

// Archive Session
app.delete("/sessions/:id", async (req, res) => {
  await Session.findByIdAndUpdate(req.params.id, { isArchived: true });
  res.json({ message: "Session archived" });
});

// ================= SERVER =================
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
