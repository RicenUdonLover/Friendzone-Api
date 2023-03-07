const User = require('../models/User');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ username: 'asc' }).select('-__v');
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
    res.json({message: `A user named ${dbUserData.username} has been created`});
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
      res.json({message: `Successfully made changes to ${user.username}`});
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteUser = async (req, res) => {
  try {
    // const thoughtsToDelete = await Thought.deleteMany({ username: req.params.username });
    const userToDelete = await User.findOneAndDelete({ _id: req.params.userId });
    if (!userToDelete) {
      res.status(404).json({ message: 'No user with that ID' });
    } else {
      res.json({message: `${userToDelete.username} has been deleted!`});
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const addFriend = async (req, res) => {
  try {
    const friendToAdd = await User.findOne({ _id: req.params.friendId });
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ message: 'No user with that ID' });
    } else {
      res.json({message: `${friendToAdd.username} is now a friend of ${user.username}!}`});
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const removeFriend = async (req, res) => {
  try {
    const friendToRemove = await User.findOne({ _id: req.params.friendId });
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ message: 'No user with that ID' });
    } else {
      res.json({message: `${friendToRemove.username} is no longer a friend of ${user.username}!}`});
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

