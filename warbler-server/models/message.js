// model for our message
const mongoose = require('mongoose');
const User = require('./user.js');

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    maxLength: 160
  },
  user: {
    // that's specifically just an object ID (unique identifier) for some user
    type: mongoose.Schema.Types.ObjectId,
    // reference to the User model
    ref: 'User'
  }
},
  // this will add a 'created' and 'updated' timestamps for each individual document that the message schema creates
  {
    timestamps: true
  }
);

// we don't want a situation where we delete a message, but a user still has that ID of the message (it could break things)
messageSchema.pre('remove', async function(next) {
  try {
    // find a user (this - a specific document, and that's why we don't use => above); this.user refers to the specific id in the schema
    let user = await User.findById(this.user);
    // remove the id of the message from their messages list
    user.messages.remove(this.id);
    console.log(this.id);
    // save that user
    await user.save();
    // return next
    return next();
  } catch (err) {
    return next(err);
  }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;