const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");

loginRouter.post("/", async (req, res) => {
  const body = req.body;

  const user = await User.findOne({ username: body.username });

  console.log(user.passwordHash) // not existing, not storing in users 
  const pwCorrect =
    user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash); // if the user exists then check pw

  if (!(user && pwCorrect)) {
    return res.status(401).json({
      error: "Invalid username or password",
    });
  }
  
  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET); // send back the users token
  
  res.status(200).send({ token: token, username: user.username, name: user.name });
});

module.exports = loginRouter;
