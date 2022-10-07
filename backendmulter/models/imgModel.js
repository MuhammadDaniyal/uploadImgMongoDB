const mongoose = require('mongoose')

const imgSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    img: {
        data: Buffer, // like array data type 
        contentType: String // buffer data type is in the format of image islya contentType
    }
})

const User = mongoose.model('User', imgSchema)

module.exports = User;