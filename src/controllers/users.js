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

usersRouter.get('/', async (req, res) => {
  const users = await User.find({})
    .populate('notes', { content: 1, date: 1 }); // same thing as transactional join query in relational dbs, gets the referenced docs in that field, second param specify which fields
  res.json(users);
});

module.exports = usersRouter;
