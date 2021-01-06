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

const unknownEndpoint = (request, response) => { //use it after the route handlers for when we didnt have any other response
  response.status(404).send({ error: 'unknown endpoint' })
}


app.get('/', (req, res) => {
  res.send('<h1>Hello World, visit /api/notes for more </h1>')
})

app.get('/api/notes', (req, res) => {
  Note.find({}).then(n => {
    res.json(n)
  })
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

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
  const id = Number(request.params.id)
  Note.findById(id).then(foundNote => {
    response.json(foundNote)
  })
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

app.use(unknownEndpoint)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


