const mongoose = require('mongoose');

// Esquema para o modelo de livro
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  isbn: {
    type: String,
    required: true,
    unique: true // Garantir que o ISBN seja único
  }
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
