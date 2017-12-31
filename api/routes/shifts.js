const express = require('express');
const app = express();
const mongoose = require('mongoose');

const Shift = require('../models/shift');
const Employee = require('../models/employee');

app.get('/', (req, res) => {
    Shift.find()
    .select('_id employee date shiftStart shiftEnd')
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            shifts: docs.map(doc => {
                return {
                    _id: doc._id,
                    employee: doc.employee,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/shifts/' + doc._id
                    }
                }
            })
        })
    })
});

app.post('/', (req, res) => {
    //check if Employee exists
    Employee.findById(req.body.employeeID)
    .then(employee => {
        if(!employee) {
            return res.status(404).json({
                message: 'Employee is not in Database'
            })
        }
        const shift = new Shift({
            _id: mongoose.Types.ObjectId(),
            employee: req.body.employeeID
        })
        return shift
        .save()
    })
    .then(result => {
        res.status(201).json({
            message: 'Shift logged',
            loggedShift: {
                _id: result._id,
                employee: result.employee,
                startShift: result.startShift,
                endShift: result.endShift
            },
            request: {
                type: 'GET',
                url: 'http://localhost:3000/shifts/' + result._id
            }
        })
    })
    .catch(err => {
        res.status(500).json({ err })
    })
})

app.get('/:shiftID', (req, res) => {
    const id = req.params.shiftID;
    Shift.findById(id)
    .exec()
    .then(shift => {
        if(!shift) {
            return res.status(404).json({
                message: 'No Shift entry found in database for id ' + id
            })
        }
        res.status(200).json({
            shift: shift,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/shifts'
            }
        })
    })
    .catch(err => {
        res.status(500).json({ error: err })
    })
})

app.delete('/:shiftID', (req, res) => {
    Shift.remove({ _id: req.params.shiftID })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Shift deleted',
            request: {
                type: 'POST',
                description: 'To add new Shift follow this pattern',
                url: 'http://localhost:3000/shifts',
                body: {
                    employeeID: 'ID',
                    startShift: 'Date',
                    endShift: 'Date'
                }
            }
        })
    })
    .catch(err => {
        res.status(500).json({ error: err })
    })
})





module.exports = app;