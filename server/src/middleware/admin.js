const jwt = require('jsonwebtoken')
const Group = require('../models/group')

const admin = async (req, res, next) => {
    try {
        const groupID = req.header('id')
        const userID = req.header('userId')
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const admin = await Group.findOne({ _id: groupID, 'admins.admin': decoded._id })
        if (!admin) { 
            if(decoded._id === userID){
                next()
            } else{
                throw new Error()
            }
        } else{
            next()
        }
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = admin