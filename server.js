const express = require("express");
// const mongoose =require("mongoose")

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "the wesite is live now " });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("http://localhost:5000/");
  console.log(`Server running on port ${PORT}`);
});
