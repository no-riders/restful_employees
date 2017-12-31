const express = require('express');
const app = express();
const mongoose = require('mongoose');


const Employee = require('../models/employee');


app.get('/', (req, res) => {
    Employee.find()
    .select('name sex contacts _id dateCreated') //to get fields what we need
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            //create more info regarding each employee
            employees: docs.map(doc => {
                return {
                    name: doc.name,
                    sex: doc.sex,
                    contacts: doc.contacts,
                    _id: doc._id,
                    dateCreated: doc.dateCreated,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/employees/' + doc._id
                    }
                }
            })
        }
        res.send(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err })
    })
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
        res.status(201).json({
            message: "New Employee has been added successfully",
            createdEmployee: {
                name: result.name,
                    sex: result.sex,
                    contacts: result.contacts,
                    _id: result._id,
                    dateCreated: result.dateCreated,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/employees/' + result._id
                    }
            }
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err })
    })
});

app.get('/:id', (req, res) => {
    const id = req.params.id;
    Employee.findById(id)
    .select('name sex contacts _id dateCreated')
    .exec()
    .then(doc => {
        console.log('From the DB ' + doc);
        doc ? res.status(200).json({
            employee: doc,
            reuest: {
                type: 'GET',
                description: 'Get all employees',
                url: 'http://localhost:3000/employees'
            }
        }) : res.status(404).json({ message: "No valid entry found for provided ID: " + id })
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
        res.status(200).json({
            message: 'Employee info has been updated',
            request: {
                type: 'GET',
                description: 'Get dettailed info about Employee',
                url: 'http://localhost:3000/employees/' + id
            }
        });
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
        res.status(200).json({
            message: 'Employee has been removed from the Data Base',
            request: {
                type: 'POST',
                description: 'To add new Employee follow this pttern',
                url: 'http://localhost:3000/employees',
                body: {
                    name: 'String',
                    sex: 'String',
                    contacts: Number
                }
            }
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err })
    })
})

module.exports = app;