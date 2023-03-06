const faker = require('faker');
const { User, Thought } = require('../models');

const NUM_USERS = 10;
const NUM_THOUGHTS = 50;

// Generate some fake user data
const generateUsers = (numUsers) => {
  const users = [];
  for (let i = 0; i < numUsers; i++) {
    const user = new User({
      username: faker.internet.userName(),
      email: faker.internet.email(),
    });
    users.push(user);
  }
  return users;
};

// Generate some fake thought data
const generateThoughts = (numThoughts, users) => {
  const thoughts = [];
  for (let i = 0; i < numThoughts; i++) {
    const thought = new Thought({
      thoughtText: faker.lorem.sentence(),
      username: users[Math.floor(Math.random() * users.length)].username,
    });
    thoughts.push(thought);
  }
  return thoughts;
};

// Seed the database
const seed = async () => {
  try {
    // Delete any existing data
    await User.deleteMany({});
    await Thought.deleteMany({});

    // Generate fake data
    const users = await User.create(generateUsers(NUM_USERS));
    const thoughts = await Thought.create(generateThoughts(NUM_THOUGHTS, users));

    // Add thoughts to users' thoughts array field
    for (let i = 0; i < thoughts.length; i++) {
      const user = users.find((u) => u.username === thoughts[i].username);
      user.thoughts.push(thoughts[i]._id);
      await user.save();
    }

    console.log(`Successfully seeded database with ${NUM_USERS} users and ${NUM_THOUGHTS} thoughts!`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();

