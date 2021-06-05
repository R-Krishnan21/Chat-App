const express = require('express');
const router = new express.Router();
const Group = require('../models/group');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const multer = require('multer');

router.post("/group/message", auth, (req,res) => {
    
    Group.findOne({"_id":req.body.id,"users.user":req.body.user})
        .exec((err,group)=>{
            if (err) return res.status(400).send(err)
            if(group){
                if(req.body.message){
                    group.messages.push(req.body.message)
                    group.save()
                    return res.status(200).send(group)
                } else {
                    return res.status(400).send("enter message")
                }
            } else {
                return res.status(401).send("lol")
            }
        })
});

router.post("/group/create", (req, res) => {

    const group = new Group;
    if(req.body.name){
        group.name = req.body.name
    }
    if(req.body.user){
        group.users.push({"user":req.body.user})
        group.admins.push({"admin":req.body.user})
    }
    group.save()
    return res.status(200).send(group)          
});

router.post("/group/addUser", auth, (req,res) => {

    if(req.body.users){
        for (let i=0; i<req.body.users.length; i++){
            Group.findOne({"_id":req.body.id,"users.user":req.body.users[i].user})
                .exec((err,group)=>{
                    if (err) return res.status(400).send(err)
                    if (!group){
                        Group.findOne({"_id":req.body.id})
                            .exec((err,group)=>{
                                if (err) return res.status(400).send(err)
                                group.users.push(req.body.users[i])
                                group.save()
                                res.status(200).send(group)
                            })
                    } else {
                        return res.status(200).send("user already exist")
                    }
                })
        }

    } else {
        res.status(400).send("add valid user")
    }
});

router.post("/group/findUser",auth, (req, res) => {

    Group.find({"users.user":req.body.user}).select("_id name")
        .exec((err, group) => {
            if (err) return res.status(400).send(err)
            if(group){
                res.status(200).send(group)
            } else {
                res.status(401).send(group)
            }
        })    
});

router.post("/group/removeUser", auth, admin, (req, res) => {

    Group.findOne({"_id":req.body.id,"users.user":req.body.users[0].user})
        .exec((err, group) => {
            if (err) return res.status(400).send(err)
            if(group){
                group.users.pull(req.body.users[0]._id)
                group.save()
                res.status(203).send(group.users)
            } else {
                res.status(401).send(group)
            }
        })
});

router.post("/group/getChat", auth, (req, res) => {

    Group.find({"_id":req.body.id})
        .exec((err, group) => {
            if (err) return res.status(400).send(err)
            res.status(200).send(group)
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

router.post("/group/uploadfiles", upload, (req, res) => {

    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err })
        }
        return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename })
    })
});

module.exports = router