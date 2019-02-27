const db = require('../models');

// /api/users/:id/messages
exports.createMessage = async function(req, res, next) {
  try {
    // get a message
    let message = await db.Message.create({
      text: req.body.text,
      // we can get specific user ID from the api request
      user: req.params.id
    });
    // find a user
    let foundUser = await db.User.findById(req.params.id);
    // add the id of the new message to the user's messages since every user that makes a message should have that id of a message associated with it
    foundUser.messages.push(message.id);
    // save user
    await foundUser.save();
    // send back the message with that user's data as well
    // find a message (we can use _id and id, both is fine)
    // the reason for populating this is instead of just getting the ID of that user (in the messageSchema) we want to get some properties about that user when we send this back - this is going to allow our API to create a message and send us back that message immediately with the username and the image of the user that created it
    // when we put the 'tweets' on the page, we're going to need the username and profile picture of the user so that we don't have to query the database again in a different request
    let foundMessage = await db.Message.findById(message._id).populate('user', {
      username: true,
      profileImageUrl: true
    });
    return res.status(200).json(foundMessage);
  } catch (err) {
    return next(err);
  }
}

exports.getMessage = async function(req, res, next) {
  try {
    // GET - /api/user/:id/messages/:message_id
    let message = await db.Message.find(req.params.message._id);
    return res.status(200).json(message);
  } catch (err) {
    return next(err);
  }
}

exports.deleteMessage = async function(req, res, next) {
  try {
    // DELETE - /api/user/:id/messages/:message_id
    // we don't use findByIdAndRemove since we have a pre 'remove' hook in our message schema
    let foundMessage = await db.Message.findById(req.params.message_id);
    await foundMessage.remove();
    return res.status(200).json(foundMessage);
  } catch (err) {
    console.log(req.params.message_id);
    return next(err);
  }
}
