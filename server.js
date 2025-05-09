const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 8080;
const cors = require("cors");
const bodyParser = require("body-parser");

// package
app.use(cors());
app.use(bodyParser.json());

// files
const db = require("./db");
const passport = require("./middleware/auth");
app.use(passport.initialize());
const authMiddleware = passport.authenticate("local", { session: false });
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const newsRoutes = require("./routes/NewsRoutes");
const commentRoutes = require("./routes/commentRoutes");
const emailConfig = require("./middleware/emailConfig");

app.get("/", (req, res) => {
  res.send("Hello");
});

//routes
app.use("/user", userRoutes);
app.use("/category", categoryRoutes);
app.use("/news", newsRoutes);
app.use("/comment", commentRoutes);

app.listen(PORT, () => {
  console.log(`Listening the port ${PORT}`);
});
