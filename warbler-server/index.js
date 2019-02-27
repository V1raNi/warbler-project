require('dotenv').config(); // load our env vars
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const errorHandler = require('./handlers/error');
const authRoutes = require('./routes/auth');
const messagesRoutes = require('./routes/messages');
const { loginRequired, ensureCorrectUser } = require('./middleware/auth');
const db = require('./models');

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); // for postman

// if there is ever any request that starts with /api/auth, go and use auth routes
app.use('/api/auth', authRoutes);
app.use('/api/users/:id/messages', loginRequired, ensureCorrectUser, messagesRoutes); // with auth middleware

// route that loads when we show the timeline of all the messages on the front end
app.get('/api/messages', loginRequired, async function(req, res, next) {
  try {
    // get all the messages sort in descending order
    // the reason we're populating the user for each individual message is so that we can get each individual username as well as img url for every message to display in our timeline (since in message it's only an ID, by populating we get an entire user object but we want just username and img url)
    let messages = await db.Message.find().sort({createdAt: 'descending'}).populate('user', {
      username: true,
      profileImageUrl: true
    });
    return res.status(200).json(messages);
  } catch (err) {
    return next(err);
  }
});

// if none of the routes reached (handler function, we can bubble up our errors):
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// it's going to take any incoming middleware with an error, and it will print out a nicer display using JSON
app.use(errorHandler);

app.listen(PORT, function() {
  console.log(`Server is starting on ${PORT}`);
});