# Friendzone-Api

Friendzone-Api is a social network web application API where users can post their thoughts, add friends, and
react to friends' thoughts. It uses Express.js for routing, a MongoDB database, and the Mongoose ODM.

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [API Routes](#api-routes)
* [Models](#models)
* [Contributing](#contributing)
* [Tests](#tests)
* [Questions](#questions)

## Installation

1. Clone the repository

```
git clone https://github.com/RicenUdonLover/Friendzone-Api.git
```

2. Install the dependencies

```
cd Friendzone-Api
npm install
```

3. (Optional) Seed the database with sample data

```
cd Friendzone-Api
npm run seed
```

4. Start the server

```
npm start
```


## Usage

Friendzone-Api exposes endpoints to manage users, thoughts, reactions, and friend lists. You can test these endpoints using a tool like [Insomnia](https://insomnia.rest/).

Make sure to check out the [API Routes](#api-routes) section to see all available endpoints.

## API Routes

### `/api/users`

- `GET` - Get all users
- `GET /:userId` - Get a single user by its `_id` and populated thought and friend data
- `POST` - Create a new user
- `PUT /:userId` - Update a user by its `_id`
- `DELETE /:userId` - Remove a user by its `_id`

### `/api/users/:userId/friends/:friendId`

- `POST` - Add a new friend to a user's friend list
- `DELETE` - Remove a friend from a user's friend list

### `/api/thoughts`

- `GET` - Get all thoughts
- `GET /:thoughtId` - Get a single thought by its `_id`
- `POST` - Create a new thought
- `PUT /:thoughtId` - Update a thought by its `_id`
- `DELETE /:thoughtId` - Remove a thought by its `_id`

### `/api/thoughts/:thoughtId/reactions`

- `POST` - Create a reaction stored in a single thought's reactions array field
- `DELETE /:reactionId` - Pull and remove a reaction by the reaction's `reactionId` value

## Models

### `User`

- `username` - String, Unique, Required, Trimmed
- `email` - String, Required, Unique, Must match a valid email address
- `thoughts` - Array of `_id` values referencing the `Thought` model
- `friends` - Array of `_id` values referencing the `User` model (self-reference)

#### Schema Settings

- Create a virtual called `friendCount` that retrieves the length of the user's `friends` array field on query.

### `Thought`

- `thoughtText` - String, Required, Must be between 1 and 280 characters
- `createdAt` - Date, Set default value to the current timestamp, Use a getter method to format the timestamp on query
- `username` - String, Required
- `reactions` - Array of nested documents created with the `Reaction` schema

#### Schema Settings

- Create a virtual called `reactionCount` that retrieves the length of the thought's `reactions` array field on query.

### `Reaction`

- `reactionId` - Use Mongoose's `ObjectId` data type, Default value is set to a new `ObjectId`
- `reactionBody` - String, Required, 280 character maximum
- `username` - String, Required
- `createdAt` - Date, Set default value to the current timestamp, Use a getter method to format the timestamp on query

#### Schema Settings

- This will not be a model, but rather will be used as the `reaction` field's subdocument schema in the `Thought` model.

## Contributing

Contributions are welcome! If you find any bugs or would like to suggest a new feature, please folk your branch instead of making pull requests to main branch.

## Tests

No test is used in this app.

## Demo

A walkthrough video about this project is available at [YouTube](https://youtu.be/fbVGDw3liFI).

## Questions

For any questions, please contact me at [riceudon@gmail.com](mailto:riceudon@gmail.com). You can also check out my GitHub profile at [https://github.com/RicenUdonLover](https://github.com/RicenUdonLover).