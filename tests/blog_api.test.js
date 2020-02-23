const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')
const User = require('../models/blog')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

const initialBlogs = [
    {
        title: 'Asyncin testaaminen',
        author: 'Asyncin keksijä',
        url: 'https://www.mozilla.com',
        likes: '444'    
    },
    {
        title: 'Komponentin testaaminen',
        author: 'Komponentin keksijä keksijä',
        url: 'https://www.mozilla.com',
        likes: '222'    
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})

    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()

    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('HTTP GET returns correct amount of blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body.length).toBe(2)
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: 'Asyncin testaaminen',
        author: 'Asyncin keksijä',
        url: 'https://www.mozilla.com',
        likes: '444'    
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const contents = response.body.map(r => r.content)

    expect(response.body.length).toBe(initialBlogs.length + 1)
})

test('Blogs are returned in correct format', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
})

test('Post requests with no defined likes sets the likes at zero', async () => {
    const newBlog = {
        title: 'Asyncin testaaminen',
        author: 'Asyncin keksijä',
        url: 'https://www.mozilla.com'   
    }
    
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)
        
    const response = await api.get('/api/blogs')

    expect(response.body[2].likes).toBe(0)
})

test('Post request with no title or url receives 400 as response', async () => {
    const newBlog1 = {
        author: 'Asyncin keksijä',
        url: 'https://www.mozilla.com'   
    }

    const newBlog2 = {
        title: 'Asyncin testaaminen',
        author: 'Asyncin keksijä' 
    }

    await api
        .post('/api/blogs')
        .send(newBlog1)
        .expect(400)

    await api
        .post('/api/blogs')
        .send(newBlog2)
        .expect(400)
})

describe('when there is initially one user at db', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const user = new User({username: 'root', password: 'sekred'})
        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'ukkokam',
            name: 'Ukko Kamula',
            password: 'salainen'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })
})



afterAll(() => {
    mongoose.connection.close()
})