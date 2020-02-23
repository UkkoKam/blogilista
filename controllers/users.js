const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const helper = require('../tests/test_helper')

usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({}).populate('blogs')

    response.json(users.map(u => u.toJSON()))
  })

usersRouter.post('/', async (request, response, next) => {
    try {
        
        if (request.body.password.length < 3) {
            return response.status(400).json({error: 'password too short'})
        }


        const body = request.body

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        const user = new User({
            username: body.username,
            name: body.name,
            passwordHash
        })

        const savedUser = await user.save()

        response.json(savedUser.toJSON())
    } catch (error) {
        if (error.name === 'ValidationError') {
            response.status(400).send({error: '`username` to be unique'})
        }
    }
})

module.exports = usersRouter