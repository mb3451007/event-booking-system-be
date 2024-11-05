const subItem = require("../model/subItemModel.js");
const item = require("../model/itemModel.js");
const mongoose = require("mongoose");

//  addSubItem
const addSubItem = async (req, res) => {
  const { name, price, isAvailable, item } = req.body;
  console.log(req.body, "body//////");
  if (!name || !price || !item) {
    return res.status(400).json({ message: "Fill all required fields" });
  }
  const media = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    const newItem = new subItem({
      name,
      price,
      isAvailable,
      items: item,
      imageUrl: media,
    });
    await newItem.save();
    return res.status(201).json({ message: "Item added successfully" });
  } catch (error) {
    console.log("Error adding item:", error);
    return res
      .status(500)
      .json({ message: "Error adding item", error: error.message });
  }
};

// get Pagnated Subitems

const getPaginatedSubItem = async (req, res) => {
  const pageNumber = parseInt(req.params.pageNumber) || 1;
  const pageSize = 10;
  try {
    const subItems = await subItem.aggregate([
      {
        $lookup: {
          from: "items",
          localField: "items",
          foreignField: "_id",
          as: "itemDetails",
        },
      },
      {
        $skip: (pageNumber - 1) * pageSize,
      },
      {
        $limit: pageSize,
      },
      {
        $project: {
          name: 1,
          isAvailable: 1,
          price: 1,
          imageUrl: 1,
          item: {
            id: { $arrayElemAt: ["$itemDetails._id", 0] },
            name: { $arrayElemAt: ["$itemDetails.name", 0] },
          },
        },
      },
    ]);

    const totalItems = await subItem.countDocuments();
    const totalPages = Math.ceil(totalItems / pageSize);
    console.log(subItems);
    res.status(200).json({ message: "Paginated items", subItems, totalPages });
  } catch (error) {
    console.error("Error getting paginated items:", error);
    res
      .status(500)
      .json({ message: "Error getting paginated items", error: error.message });
  }
};

// get All Subitems

const getAllSubItems = async (req, res) => {
  try {
    const items = await subItem.find();
    res.status(200).json({ message: "All items", items });
  } catch (error) {
    res.status(500).json({ message: "Error getting all items", error });
  }
};

// Delete SubItems
const deleteSubItem = async (req, res) => {
  const SubitemId = req.params.SubitemId;

  try {
    const deletedItem = await subItem.findByIdAndDelete(SubitemId);

    if (deletedItem) {
      res
        .status(200)
        .json({ message: "Item deleted successfully", deletedItem });
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting item", error });
  }
};

// Update SubItems
const updateSubitem = async (req, res) => {
  const subItemId = req.params.SubitemId; // Correctly reference subItemId
  const { name, price, isAvailable, item } = req.body;

  console.log("here :", subItemId);

  try {
    // Find the existing item
    const existingItem = await subItem.findById(subItemId);
    if (!existingItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Prepare updated data
    const updatedData = {
      name,
      price,
      isAvailable,
      items: item,
    };

    // Check if a new file was uploaded
    if (req.file) {
      const media = `/uploads/${req.file.filename}`; // Update the image URL
      updatedData.imageUrl = media; // Only update if a new image was uploaded
    } else {
      updatedData.imageUrl = existingItem.imageUrl; // Maintain the existing image URL
    }

    const updatedItem = await subItem.findByIdAndUpdate(
      subItemId,
      updatedData,
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "Item updated successfully", updatedItem });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error updating item", error });
  }
};

module.exports = {
  addSubItem,
  getPaginatedSubItem,
  deleteSubItem,
  updateSubitem,
  getAllSubItems,
};
