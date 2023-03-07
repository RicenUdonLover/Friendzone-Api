const { Thought, User } = require('../models');

const getAllThoughts = async (req, res) => {
    try {
        const thoughts = await Thought.find().select('-__v').sort({ username: 'asc' });
        res.json(thoughts);
    } catch (err) {
        res.status(500).json(err);
    }
};

const getThoughtById = async (req, res) => {
    try {
        const thought = await Thought.findOne({ _id: req.params.thoughtId }).select('-__v')
            .populate('reactions');
        if (!thought) {
            res.status(404).json({ message: 'No thought with that ID' });
        } else {
            res.json(thought);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const createThought = async (req, res) => {
    try {
        const newThought = await Thought.create(req.body);
        const user = await User.findOneAndUpdate(
            { _id: req.body.userId },
            {
                $push: {
                    thoughts: newThought._id,
                }
            },
            { new: true }
        );
        if (!user) {
            res.status(404).json({ message: 'No user with that ID' });
        } else {
            res.json({ message: `${user.username} is thinking: ${newThought.thoughtText}` });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const updateThought = async (req, res) => {
    try {
        const thoughtToUpdate = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!thoughtToUpdate) {
            res.status(404).json({ message: 'No thought with that ID' });
        } else {
            res.json({ message: `A thought has been updated!` });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteThought = async (req, res) => {
    try {
        const thoughtToDelete = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
        if (!thoughtToDelete) {
            res.status(404).json({ message: 'No thought with that ID' });
        } else {
            await User.findOneAndUpdate(
                { _id: thoughtToDelete.userId },
                { $pull: { thoughts: thoughtToDelete._id } },
                { new: true }
            );
            res.json({ message: `A thought of "${thoughtToDelete.thoughtText}" has been deleted!` });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const createReaction = async (req, res) => {
    try {
        const reactToThought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $push: { reactions: req.body } },
            { new: true }
        );
        if (!reactToThought) {
            res.status(404).json({ message: 'No thought with that ID' });
        } else {
            res.json({ message: `A reaction has been added to the thought of '${reactToThought.thoughtText}'!` });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteReaction = async (req, res) => {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { new: true }
        );
        if (!thought) {
            res.status(404).json({ message: 'No thought with that ID' });
        } else {
            res.json({ message: `A reaction has been removed from the thought of '${thought.thoughtText}'!` });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    getAllThoughts,
    getThoughtById,
    createThought,
    updateThought,
    deleteThought,
    createReaction,
    deleteReaction,
};
