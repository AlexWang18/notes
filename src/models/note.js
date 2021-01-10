const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  content: { // set options -> validate here
    type: String,
    minlength: 5,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  important: Boolean,
});

noteSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString(); // _id field is an Object
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

module.exports = mongoose.model('Note', noteSchema);
// Nodes way of exporting
