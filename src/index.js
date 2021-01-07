//Our backend, no support for deleting or updating / put yet

require('dotenv').config()


const Note = require('./models/note')

const express = require('express')
const app = express()

const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('build')) //when receiving a get request express will check build directory to see if there is a html file to correspond with the request 
//so going to root address or the /index.html will use the file in build dir

app.get('/', (req, res) => {
  res.send('<h1>Hello World, visit /api/notes for more </h1>')
})

app.get('/api/notes', (req, res) => {
  Note.find({}).then(n => {
    res.json(n)
  })
})

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date()
  })

  note.save().then(savedNote => { //use the models methods
    response.json(savedNote)
  })


})

app.get('/api/notes/:id', (request, response) => {
  console.log(request.params.id)

  Note.findById(request.params.id).then(foundNote => {
    if (foundNote) {
      response.json(foundNote)
    } else {
      response.status(404).end()
    }
  }).catch(err => next(err)) //delegeate to middleware
})

app.delete('/api/notes/:id', (request, response) => {

  Note.findByIdAndDelete(request.params.id).then(result => {
    response.status(204).end()
  })
    .catch(err => next(err))

})

app.put('/api/notes/:id', (req, res) => {
  const body = req.body
  const note = {
    content: body.content,
    important: body.important
  }

  Note.findByIdAndUpdate(req.params.id, note, { new: true })  //use optional 3rd parameter to force mongoose to call the modified doucment of our schema
    .then(updatedNote => {
      res.json(updatedNote.toJSON())
    })
    .catch(err => next(err))

})

const unknownEndpoint = (request, response) => { //use it after the route handlers for when we didnt have any other response
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformed id' })
  }

  next(error) //pass to default express error handler
}
app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


