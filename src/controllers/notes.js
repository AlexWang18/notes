const noteRouter = require('express').Router();
// eslint-disable-next-line no-useless-escape
const User = require('../models/user');
const Note = require('../models/note');

noteRouter.get('/', async (req, res) => {
  const notes = await Note.find({})
    .populate('user', { username: 1, name: 1 }); // only works bc of the refs in the schema's fields definition
  res.json(notes);
});

noteRouter.post('/', async (request, response) => {
  const { body } = request;

  const user = await User.findById(body.userId);

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
    user: user._id,
  });

  const savedNote = await note.save();
  user.notes = user.notes.concat(savedNote._id); // add to the users notes property
  await user.save();
  response.json(savedNote);
});

noteRouter.get('/:id', async (request, response) => {
  console.log(request.params.id);

  const foundNote = await Note.findById(request.params.id);
  if (foundNote) response.json(foundNote.toJSON()); // bson to json
  else {
    response.status(404).end();
  }
});

noteRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

noteRouter.put('/:id', async (req, res) => {
  const { body } = req;
  const note = {
    content: body.content,
    important: body.important,
  };

  const updatedNote = await Note.findByIdAndUpdate(req.params.id, note, { new: true });
  // use optional 3rd parameter to force mongoose to call the modified doucment of our schema
  res.json(updatedNote.toJSON);
});

module.exports = noteRouter;
