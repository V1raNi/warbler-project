// middleware that's going to be used after our 404 handler in index.js
// the purpose of this function is to make a generic function that is going to respond with the status of error whether it's 404 or maybe custom error that we make or 500
function errorHandler(error, req, res, next) {
  // if we don't make it to the 404 (err.status specified in index.js) that means there has been a route but something went wrong on the server (that's why 500)
  // we add json method so we can then return an object called error
  return res.status(error.status || 500).json({
    error: {
      message: error.message || 'Oops! Something went wrong!'
    }
  });
}

module.exports = errorHandler;