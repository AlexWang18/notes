/* eslint-disable no-undef */
/* eslint-disable semi */
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app) // wrap express server into a superagent object

const { initialNotes, nonExistingNote, getNotesInDB } = require('./test_helper')
const Note = require('../models/note')

beforeEach(async () => { // keep same inital state of our mongo collection
  await Note.deleteMany({})

  const noteObjs = initialNotes.map((n) => new Note(n)) // map our initial notes into an array of mongoose objects
  const promises = noteObjs.map((n) => n.save());
  await Promise.all(promises);
  // transform our array of promises into a single one, and wait for it to finish, executes the promises in paralell
})

describe('testing database', () => {
  test('notes are returned as json', async () => { // announces that the code is async
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/) // regex / /  plus \ to escape only bc not in string literal
  })

  test('a valid note can be added', async () => {
    const newNote = {
      content: 'async/await simplifies making async calls in a way that looks sync',
      important: true,
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const notesAtEnd = await getNotesInDB()
    expect(notesAtEnd).toHaveLength(initialNotes.length + 1)

    const contents = notesAtEnd.map((r) => r.content)
    expect(contents).toContain(newNote.content)
  })

  test('an invalid note is not added', async () => {
    const newNote = {
      important: false,
    }

    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)

    const notesAtEnd = await getNotesInDB()
    expect(notesAtEnd).toHaveLength(initialNotes.length)
  })

  test('a specific note can be viewed', async () => {
    const notesAtStart = await getNotesInDB()

    const notesToView = notesAtStart[0]

    const resultNote = await api
      .get(`/api/notes/${notesToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const processedNoteToView = JSON.parse(JSON.stringify(notesToView))
    expect(resultNote.body).toEqual(processedNoteToView)
  })

  test('a note can be deleted', async () => {
    const notesAtStart = await getNotesInDB()
    const noteToDelete = notesAtStart[0]

    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204)

    const notesAtEnd = await getNotesInDB()
    expect(notesAtEnd).toHaveLength(initialNotes.length - 1)

    const contents = notesAtEnd.map((r) => r.content)
    expect(contents).not.toContain(noteToDelete.content)
  })
})

afterAll((done) => {
  mongoose.connection.close()
  done()
})
