// dedicated module for route handling

const noteRouter = require('express').Router();
// eslint-disable-next-line no-useless-escape
const Note = require('C:/Users/alexw/OneDrive/Documents/AlexW Code/notes/src/models/note.js');

noteRouter.get('/', async (req, res) => {
  const notes = await Note.find({});
  res.json(notes);
});
/*   Note.find({}).then((n) => { // fetch all documents from the mongo collection
   res.json(n);
 }); */

noteRouter.post('/', async (request, response) => {
  const { body } = request;

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });
  const savedNote = await note.save();
  response.json(savedNote);
  /*  note.save()
      .then((savedNote) => savedNote.toJSON()) // explictly call to JSON and promise chain
      .then((formattedNote) => {
        response.json(formattedNote);
      })
      .catch((err) => next(err)); */
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
