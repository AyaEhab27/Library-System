const mongoose = require('mongoose');

const readerSchema = new mongoose.Schema({
  readerId: { type: Number, unique: true },
  name: { type: String, required: true },
  gender: { type: String, required: true },
  birthday: { type: Date, required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  employment: { type: String, required: true }
}, { autoIndex: false }); 

readerSchema.pre('save', async function(next) {
  if (!this.readerId) {
    const lastReader = await this.constructor.findOne({}, {}, { sort: { 'readerId': -1 } });
    this.readerId = lastReader ? lastReader.readerId + 1 : 1;
  }
  next();
});

module.exports = mongoose.model('Reader', readerSchema);