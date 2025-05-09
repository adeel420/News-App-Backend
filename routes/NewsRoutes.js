const express = require("express");
const router = express.Router();
const News = require("./../models/news");
const multer = require("multer");
const Category = require("../models/category");

const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "chat-app-images",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });

router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { title, description, category, image } = req.body;
    const categoryId = await Category.findById(category);
    const data = new News({
      title: title,
      description: description,
      image: req.file.path,
      category: categoryId,
    });
    const response = await data.save();
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const response = await News.find();
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
});

router.get("/single/:title", async (req, res) => {
  try {
    const title = req.params.title;
    const data = await News.findOne({ title: title });
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
});

router.get("/category-wise/:category", async (req, res) => {
  try {
    const category1 = req.params.category;
    const category = await Category.findOne({ category: category1 });
    const news = await News.find({ category }).populate("category");
    res.status(200).json({ category, news });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
});

router.put("/update/:id", upload.single("file"), async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    if (req.file) {
      data.image = req.file.filename;
    }
    const response = await News.findByIdAndUpdate(id, data, { new: true });
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const response = await News.findByIdAndDelete(id);
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
});

module.exports = router;
