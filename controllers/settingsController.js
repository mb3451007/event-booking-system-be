const flatRate = require('../model/settingsModel.js')

// get All Subitems

const getFlatRate = async (req, res) => {
  try {
    const items = await flatRate.find();
    res.status(200).json({ message: "All flate Rate Values", items });
  } catch (error) {
    res.status(500).json({ message: "Error getting all items", error });
  }
};


// Update SubItems
const updateFlatRate = async (req, res) => {
  const flatRateId = req.params.flatRateId;
  const { key, value } = req.body;

  try {
    const updatedKeyValue = await flatRate.findByIdAndUpdate(
        flatRateId,
      { key, value},
      { new: true } 
    );

    if (updatedKeyValue) {
     return res.status(200).json({ message: "Item updated successfully", updatedKeyValue });
    } else {
     return  res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    console.log(error)
     return res.status(500).json({ message: "Error updating item", error });
  }
};
module.exports = { updateFlatRate ,getFlatRate};
