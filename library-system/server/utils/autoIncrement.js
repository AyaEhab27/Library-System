const mongoose = require('mongoose');

const Counter = mongoose.model('Counter', new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
}));

module.exports = function(modelName) {
  return async function(next) {
    if (!this._id) {
      const counter = await Counter.findByIdAndUpdate(
        modelName,
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this._id = counter.seq;
    }
    next();
  };
};