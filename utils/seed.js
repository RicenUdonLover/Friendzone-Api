const faker = require('faker');
const connection = require('../config/connection');
const { User, Thought } = require('../models');

const userNum = 10;
const thoughtNum = 50;
connection.on('error', (err) => err);

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
    const randomUser = () => users[Math.floor(Math.random() * users.length)];
    const user = randomUser();
    const thought = new Thought({
      thoughtText: faker.lorem.sentence(),
      username: user.username,
      userId: user._id,
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
    const users = await User.create(generateUsers(userNum));
    console.log(users);
    const thoughts = await Thought.create(generateThoughts(thoughtNum, users));

    // Add thoughts to users' thoughts array field
    for (let i = 0; i < thoughts.length; i++) {
      const user = users.find((u) => u.username === thoughts[i].username);
      user.thoughts.push(thoughts[i]._id);
      await user.save();
    }

    console.log(`Successfully seeded database with ${userNum} users and ${thoughtNum} thoughts!`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

connection.once('open', () => 
seed()
);

