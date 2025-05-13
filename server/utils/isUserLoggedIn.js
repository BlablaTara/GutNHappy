function isUserLoggedIn(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({ errorMessage: "Youmust be logged in" });
    }
    next();
}

export default isUserLoggedIn;