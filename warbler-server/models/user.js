// user model
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profileImageUrl: {
    type: String
  },
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    // we don't have to pass a message right here because it is all being exported in models/index.js
    ref: 'Message'
  }]
});

// before we save the user we need to modify that password by hashing with 'pre' hook
userSchema.pre('save', async function(next) {
  // try catch to handle errors
  try {
    // if you have not modified the password we want to then move on to the next thing (a middleware, a parameter that is passed to this function - 'next' here, it means 'move on')
    // if you have not changed the password don't go and hash it again
    if(!this.isModified('password')) {
      return next();
    }
    // 1 param - a password, 2 param - a salt (work factor) - very important!
    // idea of salting is taking a bit of additional information and putting it into the hash so that the hashes are different for the same password
    // if we were to just take a piece of text and hash it, someone else could technically build a table that does that same exact algorithm and figure out what hash corresponds to a password
    // bcrypt.hash is an async action
    let hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    // saving the document
    return next();
  } catch(err) {
    // if we're passing an error to next, it's going to go to our error handler
    return next(err);
  }
});

// instance method - a method that every document that we create from this model has
// candidate password is a password coming from our form
userSchema.methods.comparePassword = async function(candidatePassword, next) {
  try {
    // we wait for the bcrypt.compare to resolve (it checks if the password is correct by re-encrypting that password which was put in the form and compares to our encrypted string in the database)
    let isMatch = await bcrypt.compare(candidatePassword, this.password);
    // returns true or false
    return isMatch;
  } catch(err) {
    next(err);
  }
}

const User = mongoose.model('User', userSchema);

module.exports = User;