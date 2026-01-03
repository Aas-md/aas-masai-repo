const express = require("express");
const mongoose = require("mongoose");

const app = express();

// mongo connect
mongoose.connect("mongodb://127.0.0.1:27017/recipedb")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// schema + model
const recipeSchema = new mongoose.Schema({
  recipe_id: Number,
  name: String,
  ingredients: [String],
  cuisine: String,
  prep_time: Number,
  difficulty: String,
  price: Number
});

const Recipe = mongoose.model("Recipe", recipeSchema);

// FAST recipes API
app.get("/fast", async (req, res) => {
  const data = await Recipe.find({ prep_time: { $lt: 30 } });
  res.json(data);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
