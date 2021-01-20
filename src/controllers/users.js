const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.post('/', async (req, res) => {
  const { body } = req; // nice destructuring
  const saltRounds = 9;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    password: passwordHash,
  });
  const savedUser = await user.save();
  res.json(savedUser);
});

module.exports = usersRouter;
