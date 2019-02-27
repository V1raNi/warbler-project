// responsible for connecting to our mongo database and setting up mongoose
const mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/warbler', {
  // making sure our connection is stable, connecting through mongoose with the latest technology with Mongo
  keepAlive: true,
  useNewUrlParser: true
});

// exporting out a property on whatever we send from index called User
// it's going to be the result of our entire user model
// this is the idea of bundling; what we can do here is create lots of properties on module.exports for all of our different models
module.exports.User = require('./user');
// by exporting this out, the Message model is able to be accessed by the User, but we have to pass on that User to the Message model
module.exports.Message = require('./message');