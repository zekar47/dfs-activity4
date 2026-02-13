const UserType = require('../models/UserType');

// Create
exports.createUserType = async (req, res) => {
  try {
    const userType = new UserType(req.body);
    await userType.save();
    res.status(201).json(userType);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All
exports.getUserTypes = async (req, res) => {
  try {
    const userTypes = await UserType.find();
    res.json(userTypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update
exports.updateUserType = async (req, res) => {
  try {
    const userType = await UserType.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!userType) {
      return res.status(404).json({ message: 'Not found' });
    }

    res.json(userType);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete
exports.deleteUserType = async (req, res) => {
  try {
    const userType = await UserType.findByIdAndDelete(req.params.id);

    if (!userType) {
      return res.status(404).json({ message: 'Not found' });
    }

    res.json({ message: 'User Type deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
