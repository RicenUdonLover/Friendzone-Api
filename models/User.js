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
userSchema.pre('remove', function (next) {
  // Remove all the thought documents that are associated with this user
  Thought.deleteMany({ username: this.username }, (err) => {
    if (err) {
      next(err);
    } else {
      next();
    }
  });
});

userSchema.virtual('friendCount')
  .get(function () {
    return `${this.friends.length}`;
  })


// Initialize our User model
const User = model('User', userSchema);

module.exports = User
