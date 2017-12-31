const mongoose = require('mongoose');

const shiftSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true }, //tie(by ID) work shift to specific employee
    date: { type: Date, default: Date.now },
    shiftStart: { type: Date, default: Date.now },
    shiftEnd: Date
})

module.exports = mongoose.model('Shift', shiftSchema);