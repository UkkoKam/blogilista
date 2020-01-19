const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let result = 0

    for(let blog in blogs) {
        result = result + blog.likes
    }
}

module.exports = {
    dummy,
    totalLikes
}