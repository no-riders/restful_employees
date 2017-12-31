const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');

app.post('/signup', (req, res) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length >= 1) {
            return res.status(409).json({
                message: 'Email address is already in Database'
            })
        } else{
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    })
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    })
                    user
                    .save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'User Created'
                        })
                    })
                    .catch((err => {
                        console.log(err);
                        res.status(500).json({ error: err })
                    }))
                }
            })
        }
    })
})

app.delete('/:userID', (req, res) => {
    User.remove({_id: req.params.userID})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'User has been removed'
        });
    })
    .catch((err => {
        console.log(err);
        res.status(500).json({ error: err })
    }))
})


module.exports = app;