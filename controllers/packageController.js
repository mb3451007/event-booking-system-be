
const packageSchema  = require('../model/packageModel.js')
const Item = require('../model/itemModel.js');
const Subitem = require('../model/subItemModel.js');
const { v4: uuidv4 } = require('uuid');


const addPackage = async (req, res) => {
  const { name  , description, price} = req.body

  if (!name || !description || !price) {
    return res.status(400).json({ message: "Fill all required fields" });
  }

  try {
    const newItem = new packageSchema({ name ,price, description });
    await newItem.save();
    return res.status(200).json({message:"package added succsessfully",newItem});
  }
  catch (error) {
    return res.status(500).json({ message: "Error adding package", error });
  }

}




const getPaginatedPackage = async (req, res) => {
  const pageNumber = parseInt(req.params.pageNumber) || 1;
  const pageSize = 10;

  try {
   
    const skip = (pageNumber - 1) * pageSize;

  
    const items = await packageSchema.find().skip(skip).limit(pageSize);
    console.log(items,'these are items in paginated packages')
    const totalItems = await packageSchema.countDocuments();

 
    const totalPages = Math.ceil(totalItems / pageSize);

    res.status(200).json({ message: "Paginated items", items, totalPages, totalItems });
  } catch (error) {
    res.status(500).json({ message: "Error getting paginated items", error });
  }
};




// get All items

const getAllPackage = async (req, res) => {
  try {
    const items = await packageSchema.find()
    res.status(200).json({ message: "All items", items });
  } catch (error) {
    res.status(500).json({ message: "Error getting all items", error });
  }
};



// Delete Items
const deletePackage = async (req, res) => {
  const packageId = req.params.packageId;

  try {
    const deletedItem = await packageSchema.findByIdAndDelete(packageId);

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
const updatePackage = async (req, res) => {
  const packageId = req.params.packageId;
  const  {name , price}  = req.body;
  try {
    const updatedItem = await packageSchema.findByIdAndUpdate(
      packageId,{ name , price },
      { new: true } 
    );

    if (updatedItem) {
     return res.status(200).json({ message: "Item updated successfully", updatedItem });
    } else {
     return  res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
     return res.status(500).json({ message: "Error updating item", error });
  }
};


// Get Package by Id including associated Item and Subitems

const getPackageById = async (req, res) => {
  const packageId = req.params.packageId;

  try {
   
    const packageData = await packageSchema.findById(packageId);

    if (!packageData) {
      return res.status(404).json({ message: 'Package not found' });
    }

    const itemsData = await Item.find({ packages:packageId ,isAvailable:true});
    if (!itemsData || itemsData.length === 0) {
      
      return res.status(200).json({
        message: 'Package retrieved successfully, but no items found',
        data: { package: packageData, itemsWithSubItems: [] }
      });
    }

    
    const itemId = itemsData.map(item=>item._id)
  
    const subItemsData = await Subitem.find({ items:{$in: itemId},isAvailable:true  });

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
    console.log(packageWithItemAndSubItems,'lllllll')

    return res.status(200).json({ message: 'Package retrieved successfully', data: packageWithItemAndSubItems });

  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving package', error });
  }
};

module.exports = { addPackage, getPaginatedPackage, deletePackage, updatePackage, getAllPackage, getPackageById };


