const express = require('express');
const app = express();
const mongoose = require('mongoose');


const Employee = require('../models/employee');


app.get('/', (req, res) => {
    Employee.find()
    .exec()
    .then(docs => {
        console.log(docs);
        res.send(docs);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err })
    })
    //res.send('Employees Page')
});

app.post('/', (req, res) => {
    const employee = new Employee({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        sex: req.body.sex,
        contacts: req.body.contacts
    })
    employee.save()
    .then(result => {
        res.send(result)
        console.log(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err })
    })
});

app.get('/:id', (req, res) => {
    const id = req.params.id;
    Employee.findById(id)
    .exec()
    .then(doc => {
        console.log('From the DB ' + doc);
        doc ? res.send(doc) : res.status(404).json({ message: "No valid entry found for provided ID: " + id })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err })
    })
})

app.patch('/:id', (req, res) => {
    const id = req.params.id;

    //ability to update only one property, not touching others or to update all
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Employee.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
        console.log(result);
        res.send(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err })
    })
})

app.delete('/:id', (req, res) => {
    const id = req.params.id;
    Employee.remove({ _id: id })
    .exec()
    .then(result => {
        res.send(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err })
    })
})

module.exports = app;