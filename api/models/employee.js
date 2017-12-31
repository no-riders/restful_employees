const mongoose = require('mongoose');


const EmployeeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    sex: String,
    contacts: { type: Number, required: true },
    dateCreated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Employee', EmployeeSchema);