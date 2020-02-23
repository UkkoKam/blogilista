const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({})

    response.json(blogs.map(blog => blog.toJSON()))
  } catch (exception) {
    next(exception)
  }
  
})

blogsRouter.post('/',  async (request, response) => {
  const body = request.body

  const user = await User.findById(body.userId)
  
  const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes ? body.likes : 0,
      user: user.id
  })

  if (blog.title && blog.url) {
    try {
      const savedBlog = await blog.save()
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()
      response.json(savedBlog.toJSON())
    } catch(exception) {
      next(exception)
    }
  } else {
    return response.status(400).json({ error: 'url and title must be present'})
  }

  
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
      await Note.findByIdAndRemove(request.params.id)
      response.status(204).end()
  } catch(exception) {
      next(exception)
  }
})

blogsRouter.put('/', async (request, response, next) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ? body.likes : 0,
    user: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'User'
    }
  })

  Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
    .then(updatedBlog => {
      response.json(updatedBlog.toJSON())
    })
    .catch(error)
    
})

module.exports = blogsRouter