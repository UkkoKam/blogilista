const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if(authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({})

    response.json(blogs.map(blog => blog.toJSON()))
  } catch (exception) {
    next(exception)
  }
  
})

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blogsToGet = await Blog.findById(request.params.id)

    response.json(blogsToGet.toJSON())
  } catch (exception) {
    console.log(exception)
  }
})

blogsRouter.post('/',  async (request, response) => {
  const body = request.body

  const token = getTokenFrom(request)

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if(!token || !decodedToken.id) {
      return response.status(401).json({error: 'token missing or'})
    }

    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes ? body.likes : 0,
      userId: user.id,
      userName: user.name
  })
  
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.json(savedBlog.toJSON())
  } catch (error) {
    console.log(error)
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
      await Note.findByIdAndRemove(request.params.id)
      response.status(204).end()
  } catch(exception) {
      console.log(exception)
  }
})

blogsRouter.put('/:id', (request, response) => {
  
    const body = request.body

    const blog = ({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      userId: body.userId,
      userName: body.userName
    })
    
    Blog.findByIdAndUpdate(request.params.id, blog)
      .then(updatedBlog => {
        response.json(updatedBlog.toJSON())
      })
    .catch(error => console.log(error.errmsg))
})


module.exports = blogsRouter