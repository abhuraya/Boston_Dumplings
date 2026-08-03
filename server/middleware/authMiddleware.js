const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({
      message: "You must be signed in.",
    });
  }

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Your session is invalid or has expired.",
    });
  }
}

module.exports = requireAuth;