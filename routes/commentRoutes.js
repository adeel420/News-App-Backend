const express = require("express");
const Comment = require("../models/comments");
const router = express();
const News = require("../models/news");
const User = require("../models/user");
const {
  jwtAuthMiddleware,
  isAdmin,
  generateToken,
} = require("./../middleware/jwt");

router.post("/create", jwtAuthMiddleware, async (req, res) => {
  try {
    const { comment, user, news } = req.body; // Include the news ID in the request body

    // Validate user and news IDs
    const userId = await User.findById(user);
    if (!userId) {
      return res.status(404).json({ error: "User not found" });
    }

    const newsId = await News.findById(news);
    if (!newsId) {
      return res.status(404).json({ error: "News not found" });
    }

    // Create and save the comment
    const newComment = new Comment({
      comment,
      user: userId._id,
      news: newsId._id,
    });

    const response = await newComment.save();
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    // Fetch comments and populate the 'user' field
    const comments = await Comment.find().populate("user", "name"); // Only populate the 'name' field of the user
    res.status(200).json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/news-comment/:newsId", async (req, res) => {
  try {
    const { newsId } = req.params;
    const comments = await Comment.find({ news: newsId }).populate(
      "user",
      "name"
    );

    res.status(200).json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
