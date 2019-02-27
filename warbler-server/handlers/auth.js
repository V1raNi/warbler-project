const db = require('../models'); // imports something exported from index
const jwt = require('jsonwebtoken'); // used to create JWT tokens

exports.signin = async function(req, res, next) {
  try {
      // finding a user
    let user = await db.User.findOne({
      email: req.body.email
    })
    let {id, username, profileImageUrl} = user;
    // checking if their password matches what was sent to the server
    let isMatch = await user.comparePassword(req.body.password);
    // if it all matches, log them in (setting a cookie in the browser, sending some information in the session or in our case signing or creating JWT tokes) and sending it back in a response
    if (isMatch) {
      let token = jwt.sign({
        id,
        username,
        profileImageUrl
      }, process.env.SECRET_KEY);
      return res.status(200).json({
        id,
        username,
        profileImageUrl,
        token
      });
    } else {
      return next({
        status: 400,
        message: 'Invalid email/password'
      });
    }
  } catch (err) {
    return next({
      status: 400,
      message: 'Invalid email/password'
    });
  }
}

exports.signup = async function(req, res, next) {
  try {
    // create a user
    // req.body is data coming from request
    let user = await db.User.create(req.body);
    // we're destructuring because when we make our token, we don't want to pass in user.id, user.username, and so on
    // we use id, not _id and it works because Mongoose assigns each of your schemas an id virtual getter by default which returns the document's _id field cast to a string, so we can use the key id instead of the original _id  stored in the database by MongoDB
    let {id, username, profileImageUrl} = user;
    // create a token (signing a token) with a secret from our env
    // if we decrypt the token we can get access to the id, username, profile image (this is going to be helpful for creating a current user or someone who's logged in)
    let token = jwt.sign({
      id,
      username,
      profileImageUrl
    }, process.env.SECRET_KEY);
    // we send OK response and data in json (sending back the id, username, profile image url, and a token) so we can see what it is and it is very helpful when we use JS to collect that data
    return res.status(200).json({
      id,
      username,
      profileImageUrl,
      token
    });
  } catch (err) {
    // this is a specific code when a validation fails
    if (err.code === 11000) {
      // default mongoose error is ugly, so we provide a nice error message for front end devs
      err.message = 'Sorry, that username and/or email is already taken';
    }
    // no matter what we're always going to return next with status 400 and some error message
    return next({
      status: 400,
      message: err.message
    });
  }
}