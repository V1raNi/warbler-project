const express = require('express');
const router = express.Router({mergeParams: true}); // mergeparams allows us to get acces to the ID inside of this router

const { createMessage, getMessage, deleteMessage } = require('../handlers/messages');

// route start with '/' because of prefix i index.js - /api/users/:id/messages; so after this entire prefix we don't need anything else
// we can attach any kind of method that we want here
router.route('/').post(createMessage);

// prefix - /api/users/id/messages/:message_id
router
  .route('/:message_id')
  .get(getMessage)
  .delete(deleteMessage);

module.exports = router;