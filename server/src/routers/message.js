const express = require('express');
const router = new express.Router();
const Chat = require('../models/chat');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');


router.post("/chat/message", auth, (req,res) => {
    Chat.findOne({"users.user":{$all:[req.body.users[0],req.body.users[1]]}})
        .exec((err, chat) => {
            if (err) return res.status(400).send(err)
            if(chat && chat.length!==0){
                if(req.body.message){
                    chat.messages.push(req.body.message)
                    chat.save()
                    return res.status(200).send(chat)
                }
            } else{
                const chat = new Chat;
                chat.save()

                if(req.body.users){
                    chat.users.push({"user":req.body.users[0]})
                    chat.users.push({"user":req.body.users[1]})
                }

                if(req.body.message){
                    chat.messages.push(req.body.message)
                }
            
                return res.status(200).send(chat)
            }
        })
})

router.post("/chat/getChat", (req, res) => {
    Chat.find({"users.user":{$all:[req.body.users[0],req.body.users[1]]}})
        .populate("users.user")
        .exec((err, chat) => {
            if (err) return res.status(400).send(err)
            res.status(200).send(chat)
        })
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/images')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (!ext.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(null, true)
    }
  })

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100000000
    }
}).single("file")

router.post("/chat/uploadfiles", upload, (req, res) => {
    
    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err })
        }
        return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename })
    })

});

module.exports = router