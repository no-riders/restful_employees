const mongoose = require('mongoose');

const EmployeeSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  shift: { type: mongoose.Schema.Types.ObjectId, ref: 'Shift' }, //tie(by ID) worker to his/her shift
  name: { type: String, required: true },
  sex: String,
  contacts: { type: Number, required: true },
  dateCreated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Employee', EmployeeSchema);