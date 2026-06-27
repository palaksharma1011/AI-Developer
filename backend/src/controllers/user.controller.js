async function userProfile(req, res) {
  res.status(200).json({
    message: "User profile",
    user: req.user,
  });
}

module.exports = { userProfile };
