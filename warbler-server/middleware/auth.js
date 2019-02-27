require('dotenv').load(); // we can use config, but we want to be super sure that we load thise in at a correct time 
const jwt = require('jsonwebtoken'); // we need to decode tokens that are passed

// make sure the user is logged in - authentication
// we use callbacks because jwt library still user callbacks, and not promises
exports.loginRequired = function(req, res, next) {
  // we get token from the HTTP header (it's some metadata about the request)
  // even though it's not an async function, we use try catch to handle situation where header is undefined
  try {
    // the way that this header usually comes in is something called 'the realm' which is kind of wat that we're doing the authentication; by convention it is Bearer <token>, so we split it by ' '
    const token = req.headers.authorization.split(' ')[1];
    // decode the token (decoded is the payload)
    jwt.verify(token, process.env.SECRET_KEY, function(error, decoded){
      // checking if the payload exists
      if (decoded) {
        return next();
      } else {
        // if token has been tempered with or we put something incorrect
        return next({
          status: 401, // unauthorized
          message: 'Please log in first'
        });
      }
    });
  } catch (err) {
    // if token wasn't passed in or not being interpreted correctly
    return next({
      status: 401, // unauthorized
      message: 'Please log in first'
    });
  }
};

// make sure we get the correct user - authorization
exports.ensureCorrectUser = function(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
      // checking if there is a payload and if id in the payload is the same as whatever is coming in the URL
      // /api/users/:id/messages
      if (decoded && decoded.id === req.params.id) {
        return next();
      } else {
        return next({
          status: 401,
          message: 'Unauthorized'
        });
      }
    });
  } catch (err) {
    return next({
      status: 401,
      message: 'Unauthorized'
    });
  }
};