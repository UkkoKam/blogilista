const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0) 
}

const favouriteBlog = (blogs) => {
    return blogs.reduce((accumulator, currentValue) =>{
        let currentMost = accumulator
        if (currentValue.likes > currentMost.likes) {
            currentMost = currentValue
        }
        return currentMost
    }, {title: '', likes: 0, author: ''})
}

const mostBlogs = (blogs) => {
    return blogs.reduce((accumulator, currentValue) => {
            
    })
}


module.exports = {
    dummy,
    totalLikes,
    favouriteBlog
}