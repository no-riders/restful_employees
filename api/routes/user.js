const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { errorCatch } = require('../utils/helpers');

const authFailed = (res) => {
    return res.status(401).json({ message: "Auth Failed" });
}

// create new user
app.post('/signup', (req, res) => {
    User.find({ email: req.body.email })
    .exec()
    .then(user => {
        if (user.length >= 1) {
            return res.status(409).json({
                message: 'Email address is already in Database'
            })
        } else {
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
                    .catch(errorCatch(res))
                }
            })
        }
    })
})

// creat token if user exists (log user in)
app.post('/login', (req, res) => {
    User.find({ email: req.body.email })
    .exec()
    .then(user => {
        if(user.length < 1) {
            return authFailed(res)
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err) {
                return authFailed(res)
            }
            if (result) {
                const token = jwt.sign(
                {
                    email: user[0].email,
                    userID: user[0]._id
                }, 
                process.env.JWT_KEY,
                {
                    expiresIn: '1h'
                }
             )
                return res.status(200).json({
                    message: 'Auth Successful',
                    token: token
                })
            }
            authFailed(res)
        })
    })
    .catch(errorCatch(res))
})

app.delete('/:userID', (req, res) => {
    User.remove({_id: req.params.userID})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'User has been removed'
        });
    })
    .catch(errorCatch(res))
})


module.exports = app;