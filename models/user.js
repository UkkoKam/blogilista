const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: String,
    name: String,
    passwordHash: String,
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectID,
            ref: 'Blog'
        }
    ],
})

userSchema.set('toJSON', {
    transfrom: (document, returnedObject) => {
        returnedObject.id = reqturnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__id
        // salasanaa EI paljasteta
        delete returnedObject.passwordHash
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User