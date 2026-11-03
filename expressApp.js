import express from 'express'

const app = express()
const PORT = 4000

app.use(express.json())

let books = [
  {
    id: 1,
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    price: 350,
    category: 'Fiction'
  },
  {
    id: 2,
    title: 'Atomic Habits',
    author: 'James Clear',
    price: 450,
    category: 'Self-Help'
  },
  {
    id: 3,
    title: 'Deep Work',
    author: 'Cal Newport',
    price: 400,
    category: 'Productivity'
  }
]

const isValid = ({ title, author, price, category }) =>
  title && author && category && typeof price === 'number'

// GET all
app.get('/books', (req, res) => res.json(books))

// GET by id
app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.id === Number(req.params.id))
  if (!book) return res.status(404).json({ error: 'Book not found' })
  res.json(book)
})

// POST
app.post('/books', (req, res) => {
  const { id } = req.body
  if (id === undefined || !isValid(req.body)) {
    return res
      .status(400)
      .json({
        error: 'id, title, author, price (number) and category are required'
      })
  }
  if (books.some(b => b.id === id)) {
    return res.status(409).json({ error: 'Book with this id already exists' })
  }
  const { title, author, price, category } = req.body
  const book = { id, title, author, price, category }
  books.push(book)
  res.status(201).json({ message: 'Book added successfully', book })
})

// PUT
app.put('/books/:id', (req, res) => {
  const book = books.find(b => b.id === Number(req.params.id))
  if (!book) return res.status(404).json({ error: 'Book not found' })

  const { title, author, price, category } = req.body
  if (price !== undefined && typeof price !== 'number') {
    return res.status(400).json({ error: 'price must be a number' })
  }
  if (title) book.title = title
  if (author) book.author = author
  if (price !== undefined) book.price = price
  if (category) book.category = category

  res.json({ message: 'Book updated successfully', book })
})

// DELETE
app.delete('/books/:id', (req, res) => {
  const index = books.findIndex(b => b.id === Number(req.params.id))
  if (index === -1) return res.status(404).json({ error: 'Book not found' })

  const [deleted] = books.splice(index, 1)
  res.json({ message: 'Book deleted successfully', book: deleted })
})

// Invalid routes
app.use((req, res) => res.status(404).json({ error: 'Route not found' }))

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`)
})
