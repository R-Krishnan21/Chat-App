const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    sender: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    message: {
        type:String,
        required: true
    },
    type: {
        type:String,
        required: true,

    }
}, { timestamps: true })

const groupSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim: true
    },
    users: [{
        user: {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required:true
        }
    }],
    admins: [{
        admin: {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required:true
        }
    }],
    avatar:{
        type:String
    },
    messages:[messageSchema]
}, { timestamps:true })

const Group = mongoose.model('Group', groupSchema)

module.exports = Group