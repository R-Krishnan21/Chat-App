const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    contacts: [{
        name: {
            type: String,
            required: true,
            trim: true
        },
        contact: {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required:true,
            unique:true
        }
    }],
}, { timestamps: true })

const Contact = mongoose.model('contact', contactSchema)

module.exports = Contact