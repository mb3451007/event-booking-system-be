const packageSchema = require('../model/packageModel.js');
const Item = require('../model/itemModel.js');
const Subitem = require('../model/subItemModel.js');
const { v4: uuidv4 } = require('uuid');

// Add Package
const addPackage = async (req, res) => {
  const {
    name,
    description,
    finalNotes,
    price,
    minPersons,
    maxPersons,
    discount,
    discountName,
    discountPercentage
  } = req.body;
console.log(req.body);
  if (!name || !description || !price || !finalNotes) {
    return res.status(400).json({ message: "Fill all required fields" });
  }

  try {
    const newItem = new packageSchema({
      name,
      price,
      description,
      finalNotes,
      minPersons,
      maxPersons,
      discount,
      discountName: discount ? discountName : null,
      discountPercentage: discount ? discountPercentage : null
    });

    await newItem.save();
    return res.status(200).json({ message: "Package added successfully", newItem });
  } catch (error) {
    return res.status(500).json({ message: "Error adding package", error });
  }
};

// Get Paginated Packages
const getPaginatedPackage = async (req, res) => {
  const pageNumber = parseInt(req.params.pageNumber) || 1;
  const pageSize = 10;

  try {
    const skip = (pageNumber - 1) * pageSize;

    const items = await packageSchema.find().skip(skip).limit(pageSize);
    const totalItems = await packageSchema.countDocuments();

    const totalPages = Math.ceil(totalItems / pageSize);

    res.status(200).json({ message: "Paginated items", items, totalPages, totalItems });
  } catch (error) {
    res.status(500).json({ message: "Error getting paginated items", error });
  }
};

// Get All Packages
const getAllPackage = async (req, res) => {
  try {
    const items = await packageSchema.find();
    res.status(200).json({ message: "All items", items });
  } catch (error) {
    res.status(500).json({ message: "Error getting all items", error });
  }
};

// Delete Package
const deletePackage = async (req, res) => {
  const packageId = req.params.packageId;

  try {
    const deletedItem = await packageSchema.findByIdAndDelete(packageId);

    if (deletedItem) {
      res.status(200).json({ message: "Package deleted successfully", deletedItem });
    } else {
      res.status(404).json({ message: "Package not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting package", error });
  }
};

// Update Package
const updatePackage = async (req, res) => {
  const packageId = req.params.packageId;
  const {
    name,
    price,
    description,
    finalNotes,
    minPersons,
    maxPersons,
    discount,
    discountName,
    discountPercentage
  } = req.body;

  try {
    const updatedItem = await packageSchema.findByIdAndUpdate(
      packageId,
      {
        name,
        price,
        description,
        finalNotes,
        minPersons,
        maxPersons,
        discount,
        discountName: discount ? discountName : null,
        discountPercentage: discount ? discountPercentage : null
      },
      { new: true } // Return the updated document
    );

    if (updatedItem) {
      return res.status(200).json({ message: "Package updated successfully", updatedItem });
    } else {
      return res.status(404).json({ message: "Package not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error updating package", error });
  }
};

// Get Package by ID (including associated Items and Subitems)
const getPackageById = async (req, res) => {
  const packageId = req.params.packageId;

  try {
    const packageData = await packageSchema.findById(packageId);

    if (!packageData) {
      return res.status(404).json({ message: 'Package not found' });
    }

    const itemsData = await Item.find({ packages: packageId, isAvailable: true });
    if (!itemsData || itemsData.length === 0) {
      return res.status(200).json({
        message: 'Package retrieved successfully, but no items found',
        data: { package: packageData, itemsWithSubItems: [] }
      });
    }

    const itemId = itemsData.map(item => item._id);
    const subItemsData = await Subitem.find({ items: { $in: itemId }, isAvailable: true });

    const itemsWithSubItems = itemsData.map(item => {
      const relatedSubItems = subItemsData.filter(sub => sub.items.equals(item._id));
      return {
        item,
        subItems: relatedSubItems
      };
    });

    const packageWithItemAndSubItems = {
      package: packageData,
      itemsWithSubItems
    };

    return res.status(200).json({ message: 'Package retrieved successfully', data: packageWithItemAndSubItems });
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving package', error });
  }
};

module.exports = {
  addPackage,
  getPaginatedPackage,
  deletePackage,
  updatePackage,
  getAllPackage,
  getPackageById
};
