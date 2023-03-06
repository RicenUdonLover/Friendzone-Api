const router = require('express').Router();
const {
  getSinglePost,
  getPosts,
  createPost,
} = require('../../controllers/thoughtController');

router.route('/').get(getPosts).post(createPost);

router.route('/:postId').get(getSinglePost);

module.exports = router;
