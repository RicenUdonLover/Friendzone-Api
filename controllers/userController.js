const User = require('../models/User');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId })
      .select('-__v')
      .populate({
        path: 'thoughts',
        select: '-__v',
        options: {
          sort: { createdAt: -1 },
        },
      })
      .populate({
        path: 'friends',
        select: '-__v',
      });
    if (!user) {
      res.status(404).json({ message: 'No user with that ID' });
    } else {
      res.json(user);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const createUser = async (req, res) => {
  try {
    const dbUserData = await User.create(req.body);
    res.json(`${dbUserData} has been created`);
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!user) {
      res.status(404).json({ message: 'No user with that ID' });
    } else {
      res.json(`${user} has been updated to ${user.username}`);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.userId });
    if (!user) {
      res.status(404).json({ message: 'No user with that ID' });
    } else {
      res.json(`${user} has been deleted!`);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const addFriend = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ message: 'No user with that ID' });
    } else {
      res.json(`${user.username} now had a new friend!`);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const removeFriend = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ message: 'No user with that ID' });
    } else {
      res.json(`A friend of ${user.username} has been removed}`);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
};

