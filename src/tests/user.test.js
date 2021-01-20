/* eslint-disable semi */
const bcrypt = require('bcrypt')
const User = require('../models/user')

const helper = require('./test_helper')

describe('only one user in DB', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })
  test('creation succeeds with fresh username', async () => {
      const usersAtStart = await helper.getUsersInDB()
  })
})
