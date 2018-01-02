const express = require('express');
const app = express();
const mongoose = require('mongoose');


const Employee = require('../models/employee');
const Shift = require('../models/shift');


const { errorCatch, requestGet, requestPost } = require('../utils/helpers');

const detailedInfoStr = 'Get detailed info about Employee';
const descriptionAddStr = 'To add new Employee follow this pattern';
const url = 'http://localhost:3000/employees/'
const descriptionAddBody = {
    type: "POST",
    description: descriptionAddStr,
    url,
    body: {
        name: "String",
        sex: "String",
        contacts: Number
    }
}


app.get('/', (req, res) => {
    Employee.find()
    .select('shift _id name sex contacts dateCreated') //to get fields what we need
    .populate('shift')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            //create more info regarding each employee
            employees: docs.map(doc => {
                const { name, sex, contacts, _id, dateCreated, shift } = doc;
                console.log(shift);
                return {
                    _id,
                    shift,
                    name, 
                    sex, 
                    contacts,
                    dateCreated,
                    request: requestGet(url, _id)
                }
            })
        }
        res.send(response);
    })
    .catch(errorCatch(res))
});

app.post('/', (req, res) => {
    const { name, sex, contacts, dateCreated } = req.body;
    const employee = new Employee({
        _id: new mongoose.Types.ObjectId(),
        name,
        sex,
        contacts
    })
    employee.save()
    .then(result => {
        const { name, sex, contacts, _id, dateCreated } = result;
        res.status(201).json({
            message: "New Employee has been added successfully",
            createdEmployee: {
                name,
                sex, 
                contacts,
                _id, 
                dateCreated,
                request: requestGet(url, _id)
            }
        })
    })
    .catch(errorCatch(res))
});

app.get('/:id', (req, res) => {
    const id = req.params.id;
    Employee.findById(id)
    .select('_id shift name sex contacts dateCreated')
    .populate('shift')
    .exec()
    .then(employee => {
        if(!employee) {
            return res.status(404).json({
                message: 'Employee is not in Database'
            })
        }
        res.status(200).json({
            employee,
            request: requestGet(url, id, detailedInfoStr)
        })
    })
    .catch(errorCatch(res))
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
        res
          .status(200)
          .json({
            message: "Employee info has been updated",
            request: requestGet(url, id, detailedInfoStr)
          });
      })
      .catch(errorCatch(res));
})

app.delete('/:id', (req, res) => {
    const id = req.params.id;
    Employee.remove({ _id: id })
      .exec()
      .then(result => {
        res
          .status(200)
          .json({
            message: "Employee has been removed from the Database",
            request: requestPost(url, descriptionAddStr)
          });
      })
      .catch(errorCatch(res));
})

module.exports = app, errorCatch;