const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  bookId: { type: Number, unique: true },
  title: { type: String, required: true },
  publicationDate: { type: Date, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  publisher: { type: String, required: true },
  language: { type: String, required: true }
}, { autoIndex: false }); 

bookSchema.pre('save', async function(next) {
  if (!this.bookId) {
    const lastBook = await this.constructor.findOne({}, {}, { sort: { 'bookId': -1 } });
    this.bookId = lastBook ? lastBook.bookId + 1 : 1;
  }
  next();
});

module.exports = mongoose.model('Book', bookSchema);