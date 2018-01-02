const express = require('express');
const app = express();
const mongoose = require('mongoose');

const Shift = require('../models/shift');
const Employee = require('../models/employee');


const { errorCatch, requestGet, requestPost } = require('../utils/helpers');

const detailedInfoStr = 'Get detailed info about Shift';
const descriptionAddStr = 'To add new Shift follow this pattern';
const url = 'http://localhost:3000/shifts/'
const descriptionAddBody = {
    type: "POST",
    description: descriptionAddStr,
    url,
    body: {
        employeeID: 'ID',
        startShift: 'Date',
        endShift: 'Date'
    }
}

app.get('/', (req, res) => {
    Shift.find()
    .select('_id employee date shiftStart shiftEnd')
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            shifts: docs.map(doc => {
                const { _id, employee } = doc;
                return {
                    _id,
                    employee,
                    request: requestGet(url, _id)
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
        const { _id, employee, startShift, endShift } = result;
        res.status(201).json({
            message: 'Shift logged',
            loggedShift: {
                _id,
                employee,
                startShift,
                endShift
            },
            request: requestGet(url, _id)
        })
    })
    .catch(errorCatch(res))
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
            shift,
            request: requestGet(url, id)
        })
    })
    .catch(errorCatch(res))
})

app.delete('/:shiftID', (req, res) => {
    Shift.remove({ _id: req.params.shiftID })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Shift deleted',
            request: requestPost()
        })
    })
    .catch(errorCatch(res))
})





module.exports = app;