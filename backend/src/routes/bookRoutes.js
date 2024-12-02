const express = require('express');
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Rota para listar todos os livros
router.get('/', bookController.getAllBooks);

// Rota para adicionar um novo livro
router.post('/', authMiddleware, bookController.addBook);

// Rota para atualizar um livro existente
router.put('/:id', bookController.updateBook);

// Rota para excluir um livro
router.delete('/:id', authMiddleware, bookController.deleteBook);

// Rota para obter um livro pelo ID
router.get('/:id', bookController.getBookById);


module.exports = router;
