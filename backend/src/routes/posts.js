const { Router } = require('express');
const { getPosts } = require('../controllers/postsController');

const router = Router();

router.get('/', getPosts);

module.exports = router;
