
const Item  = require('../model/itemModel.js')
const packages = require('../model/packageModel.js')
const { v4: uuidv4 } = require('uuid');
const mongoose=require("mongoose")


const addItem = async (req, res) => {
  const { name, isAvailable, packages } = req.body;
console.log(req.body);
  if (!name  || !packages || packages.length === 0) {
    return res.status(400).json({ message: "Fill all required fields" });
  }

  try {
    const packageId = new mongoose.Types.ObjectId(packages);  // Correct spelling
console.log(packageId)
    const newItem = new Item({ name, isAvailable ,packages:packageId });
     await newItem.save();
    return res.status(201).json({ message: "Item added successfully" });
  } catch (error) {
    console.log("Error adding item:", error);
    return res.status(500).json({ message: "Error adding item", error: error.message });
  }
};




// get Pagnated items
const getPaginatedItem = async (req, res) => {
  const pageNumber = parseInt(req.params.pageNumber) || 1;
  const pageSize = 10;

  try {
    const items = await Item.aggregate([
      {
        $lookup: {
          from: 'packages',  // Ensure this matches the actual collection name in MongoDB
          localField: 'packages',
          foreignField: '_id',
          as: 'packageDetails'
        }
      },
      {
        $skip: (pageNumber - 1) * pageSize
      },
      {
        $limit: pageSize
      },
      {
        $project: {
          name: 1,
          isAvailable: 1,
          package: {
            id: { $arrayElemAt: ['$packageDetails._id', 0] },
            name: { $arrayElemAt: ['$packageDetails.name', 0] }
          }
        }
      }
    ]);

    const totalItems = await Item.countDocuments();
    const totalPages = Math.ceil(totalItems / pageSize);

    res.status(200).json({ message: "Paginated items", items, totalPages });
  } catch (error) {
    console.error("Error getting paginated items:", error);  // Log error details
    res.status(500).json({ message: "Error getting paginated items", error: error.message });
  }
};




// get All items

const getAllItems = async (req, res) => {
  try {
    const items = await Item.aggregate([
      {
        $lookup: {
          from: 'itemsubitems',
          localField: '_id',
          foreignField: 'item_id',
          as: 'subItemsAndPackages'
        }
      },
      {
        $lookup: {
          from: 'packages',
          localField: 'subItemsAndPackages.package_id',
          foreignField: '_id',
          as: 'packageDetails'
        }
      },
      {
        $project: {
          name: 1,
          isAvailable: 1,
          subItems: '$subItemsAndPackages.subitem_id',
          packages: {
            $map: {
              input: '$packageDetails',
              as: 'package',
              in: {
                id: '$$package._id',
                name: '$$package.name',
                price: '$$package.price'
              }
            }
          }
        }
      }
    ]);

    res.status(200).json({ message: "All items", items });
  } catch (error) {
    res.status(500).json({ message: "Error getting all items", error });
  }
};





// Delete Items
const deleteItem = async (req, res) => {
  const itemId = req.params.itemId;

  try {
    const deletedItem = await Item.findByIdAndDelete(itemId);

    if (deletedItem) {
      res.status(200).json({ message: "Item deleted successfully", deletedItem });
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting item", error });
  }
};


// Update Items
const updateitem = async (req, res) => {
  const itemId = req.params.itemId;
  const { name, isAvailable, packages } = req.body;
console.log(packages)
  try {
    // Update the item in the Item collection
    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
     
      { name, isAvailable, packages },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Remove the old subItem and package associations
    

    // Create new subItem and package associations
     

    

    // Save the new associations
     

    return res.status(200).json({ message: "Item updated successfully", updatedItem });
  } catch (error) {
    console.log("Error updating item:", error);
    return res.status(500).json({ message: "Error updating item", error });
  }
};

module.exports = { addItem, getPaginatedItem, deleteItem, updateitem ,getAllItems};
