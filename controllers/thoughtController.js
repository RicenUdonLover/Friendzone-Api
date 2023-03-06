const { Thought, User } = require('../models');

const getAllThoughts = async (req, res) => {
    try {
        const thoughts = await Thought.find().sort({ createdAt: -1 });
        res.json(thoughts);
    } catch (err) {
        res.status(500).json(err);
    }
};

const getThoughtById = async (req, res) => {
    try {
        const thought = await Thought.findOne({ _id: req.params.thoughtId }).populate('reactions');
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
            { $push: { thoughts: newThought._id } },
            { new: true }
        );
        if (!user) {
            res.status(404).json({ message: 'No user with that ID' });
        } else {
            res.json(newThought);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const updateThought = async (req, res) => {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!thought) {
            res.status(404).json({ message: 'No thought with that ID' });
        } else {
            res.json(thought);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteThought = async (req, res) => {
    try {
        const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
        if (!thought) {
            res.status(404).json({ message: 'No thought with that ID' });
        } else {
            await User.findOneAndUpdate(
                { _id: thought.userId },
                { $pull: { thoughts: thought._id } },
                { new: true }
            );
            res.json(thought);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const createReaction = async (req, res) => {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $push: { reactions: req.body } },
            { new: true }
        );
        if (!thought) {
            res.status(404).json({ message: 'No thought with that ID' });
        } else {
            res.json(thought);
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
            res.json(thought);
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
