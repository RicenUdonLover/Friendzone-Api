const { Schema, model } = require('mongoose');
const Thought = require('./Thought');

// Schema to create User model
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Please enter a valid email address'], // regex to validate email
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought',
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// pre middleware to remove associated thoughts when a user is deleted
userSchema.pre('remove', async function (next) {
  try {
    await Thought.deleteMany({ userId: this._id }).exec();
    next();
  } catch (err) {
    next(err);
  }
});



userSchema.virtual('friendCount')
  .get(function () {
    return `${this.friends.length}`;
  })


// Initialize our User model
const User = model('User', userSchema);

module.exports = User
