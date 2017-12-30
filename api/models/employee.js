const mongoose = require('mongoose');


let EmployeeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    sex: String,
    contacts: String,
    dateCreated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Employee', EmployeeSchema);