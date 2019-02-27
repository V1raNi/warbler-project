const express = require('express');
const router = express.Router();
const { signin, signup } = require('../handlers/auth'); // we can bring entire module and then attach signup if we want or we can just destructure the signup function

// the function is in the handlers folder
router.post('/signup', signup);

router.post('/signin', signin);

module.exports = router;