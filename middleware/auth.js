const jwt = require("jsonwebtoken");
const tokenSchema = require('../model/token');
const config = process.env;

const verifyToken = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    const tokenRes = await tokenSchema.findOne({ token });
    if (tokenRes === null) {
      throw "Invalid token"
    }

    req.user = decoded;

  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken