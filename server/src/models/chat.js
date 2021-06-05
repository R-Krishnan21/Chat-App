const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    sender: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message: {
        type:String,
        required: true,

    },
    type: {
        type:String,
        required: true,

    }
}, { timestamps: true })

const chatSchema = new mongoose.Schema({
    users: [{
        user: {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required:true,
            unique:true
        }
    }],
    messages: [messageSchema]
})

const Chat = mongoose.model('Chat', chatSchema)

module.exports = Chat