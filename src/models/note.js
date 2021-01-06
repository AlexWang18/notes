const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
const password = process.argv[2]


console.log('Connecting to ', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(result => {
        console.log('Connected to MongoDB')
    }).catch(error => {
        console.log('error connecting to MongoDB ', error.message)
    })

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean
})

noteSchema.set('toJSON', {
    transform: (document, returnedObj) => {
        returnedObj.id = returnedObj._id.toString() //_id field is an Object
        delete returnedObj._id
        delete returnedObj.__v
    }
})

module.exports = mongoose.model('Note', noteSchema)
//Nodes way of exporting