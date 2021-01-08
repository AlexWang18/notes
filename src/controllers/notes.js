// dedicated module for route handling

const noteRouter = require('express').Router();
// eslint-disable-next-line no-useless-escape
const Note = require('C:/Users/alexw/OneDrive/Documents/AlexW Code/notes/src/models/note.js');

noteRouter.get('/', (req, res) => {
  Note.find({}).then((n) => { // fetch all documents from the mongo collection
    res.json(n);
  });
});

noteRouter.post('/', (request, response, next) => {
  const { body } = request;

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  note.save()
    .then((savedNote) => savedNote.toJSON()) // explictly call to JSON and promise chain
    .then((formattedNote) => {
      response.json(formattedNote);
    })
    .catch((err) => next(err));
});

noteRouter.get('/:id', (request, response, next) => {
  console.log(request.params.id);

  Note.findById(request.params.id).then((foundNote) => {
    if (foundNote) {
      response.json(foundNote.toJSON()); // bson to json
    } else {
      response.status(404).end();
    }
  }).catch((err) => next(err)); // delegeate to middleware
});

noteRouter.delete('/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id).then((result) => {
    response.status(204).end();
  })
    .catch((err) => next(err));
});

noteRouter.put('/:id', (req, res) => {
  const { body } = req;
  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(req.params.id, note, { new: true })
  // use optional 3rd parameter to force mongoose to call the modified doucment of our schema
    .then((updatedNote) => {
      res.json(updatedNote.toJSON());
    })
    .catch((err) => next(err));
});

module.exports = noteRouter;
