const Book = require('../models/Book');  // Importando o modelo Book

// Adicionar um novo livro
exports.addBook = async (req, res) => {
  // Desestrutura os dados enviados no corpo da requisição
  const { title, author, year, description, isbn } = req.body;

  try {
    // Cria uma nova instância do modelo Book com os dados recebidos
    const newBook = new Book({ title, author, year, description, isbn });

    // Salva o novo livro no banco de dados
    await newBook.save();

    // Responde ao cliente informando que o livro foi adicionado com sucesso, incluindo os dados do livro salvo
    res.status(201).json({ message: 'Livro adicionado com sucesso', newBook });
  } catch (error) {
    // Em caso de erro, responde com o status 500 (erro do servidor) e a mensagem de erro
    res.status(500).json({ message: 'Erro ao adicionar livro', error });
  }
};

// Listar todos os livros
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find()
      .sort({ createdAt: -1 }) // Ordena pelos livros mais recentes (com base em createdAt)
      .limit(10); // Limita a 10 livros
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter livros', error: error.message });
  }
};

// Atualizar um livro existente
exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, year, description } = req.body;

  // Verifique se os campos obrigatórios foram fornecidos
  if (!title || !author || !year) {
    return res.status(400).json({ message: 'Título, autor e ano são obrigatórios.' });
  }

  try {
    const updatedBook = await Book.findByIdAndUpdate(id, { title, author, year, description }, { new: true });

    if (!updatedBook) {
      return res.status(404).json({ message: 'Livro não encontrado' });
    }

    res.status(200).json({ message: 'Livro atualizado com sucesso', updatedBook });
  } catch (error) {
    console.error('Erro ao atualizar livro:', error);
    res.status(500).json({ message: 'Erro ao atualizar livro', error: error.message, stack: error.stack });
  }
};

// Deletar um livro
exports.deleteBook = async (req, res) => {
  // Obtém o id do livro a ser deletado da URL da requisição (parâmetro)
  const { id } = req.params;

  try {
    // Busca o livro pelo ID
    const deletedBook = await Book.findByIdAndDelete(id);

    // Se o livro não for encontrado, responde com erro 404
    if (!deletedBook) {
      return res.status(404).json({ message: 'Livro não encontrado' });
    }

    // Responde confirmando a exclusão
    res.status(200).json({ message: 'Livro excluído com sucesso' });
  } catch (error) {
    // Em caso de erro, responde com status 500 e a mensagem de erro
    res.status(500).json({ message: 'Erro ao excluir livro', error: error.message });
  }
};


// Buscar livros
exports.searchBooks = async (req, res) => {
  const { title, author, year, isbn } = req.query;

  // Cria um objeto de filtro
  const filter = {};

  if (title) filter.title = { $regex: title, $options: 'i' }; // Busca pelo título, ignorando maiúsculas/minúsculas
  if (author) filter.author = { $regex: author, $options: 'i' }; // Busca pelo autor, ignorando maiúsculas/minúsculas
  if (year) filter.year = year; // Busca pelo ano
  if (isbn) filter.isbn = isbn; // Busca pelo ISBN

  try {
    const books = await Book.find(filter);
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar livros', error });
  }
};

// Buscar um livro pelo ID
exports.getBookById = async (req, res) => {
  const { id } = req.params; // Obtém o ID da URL da requisição

  try {
    // Busca o livro pelo ID no banco de dados
    const book = await Book.findById(id);

    // Se o livro não for encontrado, retorna um erro 404
    if (!book) {
      return res.status(404).json({ message: 'Livro não encontrado' });
    }

    // Retorna o livro encontrado
    res.status(200).json(book);
  } catch (error) {
    // Caso ocorra algum erro no banco de dados, retorna um erro 500
    res.status(500).json({ message: 'Erro ao obter livro', error: error.message });
  }
};