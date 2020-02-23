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






afterAll(() => {
    mongoose.connection.close()
})