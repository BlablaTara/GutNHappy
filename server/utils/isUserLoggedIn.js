function isUserLoggedIn(req, res, next) {
  if (!req.session.user) {
    return res.status(403).json({ errorMessage: "You must be logged in" });
  }
  next();
}

export default isUserLoggedIn;
