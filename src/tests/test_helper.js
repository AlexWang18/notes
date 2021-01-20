/* eslint-disable indent */
/* eslint-disable no-unused-vars */
const Note = require('../models/note');
const User = require('../models/user');

const initialNotes = [
    {
        content: 'HTML is easy',
        date: new Date(),
        important: false,
      },
      {
        content: 'Browser can execute only Javascript',
        date: new Date(),
        important: true,
      },
];

const nonExistingId = async () => {
    const note = new Note({ content: 'willremovethissoon', date: new Date() });
    await note.save();
    await note.remove();

    return note._id.toString();
  };

const getNotesInDB = async () => {
    const notes = await Note.find({});
    return notes.map((n) => n.toJSON());
};

const getUsersInDB = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
    initialNotes, nonExistingId, getNotesInDB, getUsersInDB,
};
