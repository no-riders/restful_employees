const express = require('express');
const app = express();


app.get('/', (req, res) => {
    res.send('Employees Page')
});

app.post('/', (req, res) => {
    const employee = {
        name: req.body.name,
        sex: req.body.sex,
        contacts: req.body.contacts
    }
    res.send(employee)
});

app.get('/:id', (req, res) => {
    const id = req.params.id;
    res.send(`Get Person ${id}`)
})

app.patch('/:id', (req, res) => {
    const id = req.params.id;
    res.send(`Update Person ${id}`)
})

app.delete('/:id', (req, res) => {
    const id = req.params.id;
    res.send(`Update Person ${id}`)
})

module.exports = app;