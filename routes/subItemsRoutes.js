const express = require("express");
const Router = express.Router();
const {
  addSubItem,
  getPaginatedSubItem,
  deleteSubItem,
  updateSubitem,
  getAllSubItems,
} = require("../controllers/subItem-controller.js");
const upload = require("../middleware/upload.js");

Router.post("/add-Subitem", upload.single("image"), addSubItem);
Router.get("/get-Subitems/:pageNumber", getPaginatedSubItem);
Router.get("/get-Subitems", getAllSubItems);
Router.delete("/delete-Subitem/:SubitemId", deleteSubItem);
Router.patch(
  "/update-Subitem/:SubitemId",
  upload.single("image"),
  updateSubitem
);
module.exports = Router;
