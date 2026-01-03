const express = require("express");
const apiRoutes = require("./api");

const app = express();
app.use(express.json());

// use api routes
app.use("/api", apiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "404 Not Found" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
