const express = require('express');
const router = new express.Router();
const Contact = require('../models/contactList');
const auth = require('../middleware/auth');
const path = require('path');


router.post("/contact/add", (req, res) => {
    Contact.findOne({"user":req.body.user, "contacts.contact":req.body.contacts.contact})
        .exec((err,contact)=>{
            if(err) return res.status(404).send(err)

            if(!contact){
                Contact.findOne({"user":req.body.user})
                    .exec((err,contact)=>{

                        if(err) return res.status(400).send(err)

                        if(contact){
                            if(req.body.contacts){
                                if(req.body.user == req.body.contacts.contact){
                                    return res.status(403).send("user cannot add itself to contact")

                                } else{
                                    contact.contacts.push(req.body.contacts)
                                    contact.save()
                                    return res.status(200).send(contact)
                                }
                            } else {
                                return res.status(400).send("no contact provided")
                            }
                        } else{
                        
                            const contact = new Contact;

                            if(req.body.user){
                                contact.user = req.body.user
                            }

                            if(req.body.contacts){
                                contact.contacts.push(req.body.contacts)
                            }

                            contact.save()

                            return res.status(201).send(contact)

                        }
                    })
            } else {
                return res.status(400).send("user already exist")
            }
        })
});

router.post("/contact/list",auth,(req,res)=>{
    Contact.findOne({"user":req.body.user})
        .exec((err,list)=>{
            if(err) return res.status(404).send(err)

            return res.status(200).send(list)
        })
});

module.exports = router