//check using which strategy user has authenticated and return corresponding dictionary
//added to as an example of helper function

module.exports = function (req, res) {
  if (req.user.local.email){
    return req.user.local
  }
  if (req.user.google.email){
    return req.user.google
  }
};