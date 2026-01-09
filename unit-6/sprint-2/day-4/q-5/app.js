const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// ================= DB CONNECT =================
mongoose.connect("mongodb://127.0.0.1:27017/movieBookingDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ================= SCHEMAS =================
const movieSchema = new mongoose.Schema({
  _id: String,
  title: String,
  genre: String,
  releaseYear: Number,
  durationMins: Number,
});

const userSchema = new mongoose.Schema({
  _id: String,
  name: String,
  email: String,
  joinedAt: Date,
});

const bookingSchema = new mongoose.Schema({
  _id: String,
  userId: String,
  movieId: String,
  bookingDate: Date,
  seats: Number,
  status: String, // Booked, Cancelled
});

const Movie = mongoose.model("Movie", movieSchema);
const User = mongoose.model("User", userSchema);
const Booking = mongoose.model("Booking", bookingSchema);

// ================= CREATE ROUTES =================

// POST /movies
app.post("/movies", async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(200).json(movie);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /users
app.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /bookings (validate user & movie)
app.post("/bookings", async (req, res) => {
  try {
    const { userId, movieId } = req.body;

    const user = await User.findById(userId);
    const movie = await Movie.findById(movieId);

    if (!user || !movie) {
      return res.status(400).json({ error: "Invalid user or movie" });
    }

    const booking = await Booking.create(req.body);
    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= AGGREGATION ROUTES =================

// 1️⃣ Total bookings & seats per movie
app.get("/analytics/movie-bookings", async (req, res) => {
  const data = await Booking.aggregate([
    {
      $group: {
        _id: "$movieId",
        totalBookings: { $sum: 1 },
        totalSeats: { $sum: "$seats" }
      }
    },
    {
      $lookup: {
        from: "movies",
        localField: "_id",
        foreignField: "_id",
        as: "movie"
      }
    },
    { $unwind: "$movie" },
    {
      $project: {
        movieTitle: "$movie.title",
        totalBookings: 1,
        totalSeats: 1
      }
    }
  ]);
  res.json(data);
});

// 2️⃣ User booking history with movie titles
app.get("/analytics/user-bookings", async (req, res) => {
  const data = await Booking.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" },
    {
      $lookup: {
        from: "movies",
        localField: "movieId",
        foreignField: "_id",
        as: "movie"
      }
    },
    { $unwind: "$movie" },
    {
      $project: {
        userName: "$user.name",
        movieTitle: "$movie.title",
        seats: 1,
        status: 1,
        bookingDate: 1
      }
    }
  ]);
  res.json(data);
});

// 3️⃣ Users who booked more than 2 times
app.get("/analytics/top-users", async (req, res) => {
  const data = await Booking.aggregate([
    {
      $group: {
        _id: "$userId",
        bookingCount: { $sum: 1 }
      }
    },
    { $match: { bookingCount: { $gt: 2 } } },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" },
    {
      $project: {
        userName: "$user.name",
        bookingCount: 1
      }
    }
  ]);
  res.json(data);
});

// 4️⃣ Genre-wise total seats booked
app.get("/analytics/genre-wise-bookings", async (req, res) => {
  const data = await Booking.aggregate([
    {
      $lookup: {
        from: "movies",
        localField: "movieId",
        foreignField: "_id",
        as: "movie"
      }
    },
    { $unwind: "$movie" },
    {
      $group: {
        _id: "$movie.genre",
        totalSeats: { $sum: "$seats" }
      }
    }
  ]);
  res.json(data);
});

// 5️⃣ Active bookings with user & movie details
app.get("/analytics/active-bookings", async (req, res) => {
  const data = await Booking.aggregate([
    { $match: { status: "Booked" } },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" },
    {
      $lookup: {
        from: "movies",
        localField: "movieId",
        foreignField: "_id",
        as: "movie"
      }
    },
    { $unwind: "$movie" },
    {
      $project: {
        userName: "$user.name",
        movieTitle: "$movie.title",
        seats: 1,
        bookingDate: 1
      }
    }
  ]);
  res.json(data);
});

// ================= SERVER =================
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
