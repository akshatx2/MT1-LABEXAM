import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// ES modules don't have __dirname, so we rebuild it
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = 3000

const books = [
  { id: 1, title: 'The Alchemist', author: 'Paulo Coelho', price: 350 },
  { id: 2, title: 'Atomic Habits', author: 'James Clear', price: 450 },
  { id: 3, title: 'Deep Work', author: 'Cal Newport', price: 400 }
]

// Helper to send JSON responses
const sendJSON = (res, status, data) => {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(data))
}

const server = http.createServer((req, res) => {
  const { url, method } = req

  // GET /
  // GET /
  if (url === '/' && method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8; charset=utf-8'
    })
    return res.end(`
      <body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
        background:linear-gradient(135deg,#0f172a,#1e1b4b);font-family:Segoe UI,sans-serif;color:#e2e8f0;text-align:center;">
        <div>
          <h1 style="font-size:2.8rem;margin:0 0 10px;">📚 Welcome to the Library</h1>
          <p style="color:#94a3b8;">Book Management System</p>
          <a href="/home" style="display:inline-block;margin-top:20px;padding:12px 24px;border-radius:10px;
            background:linear-gradient(90deg,#38bdf8,#a78bfa);color:#0f172a;font-weight:700;text-decoration:none;">
            Enter Library →
          </a>
        </div>
      </body>
    `)
  }

  // GET /books
  if (url === '/books' && method === 'GET') {
    return sendJSON(res, 200, books)
  }

  // GET /about
  if (url === '/about' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' })
    return res.end(
      'Library Book Management App - built with Node.js HTTP and FS modules.'
    )
  }

  // GET /home -> serve public/index.html using fs
  if (url === '/home' && method === 'GET') {
    const filePath = path.join(__dirname, 'public', 'index.html')
    return fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500, {
          'Content-Type': 'text/html; charset=utf-8; charset=utf-8'
        })
        return res.end('<h1>500 - Could not read file</h1>')
      }
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8; charset=utf-8'
      })
      res.end(content)
    })
  }

  // POST /add-book
  if (url === '/add-book' && method === 'POST') {
    let body = ''
    req.on('data', chunk => (body += chunk))
    req.on('end', () => {
      let book
      try {
        book = JSON.parse(body)
      } catch {
        return sendJSON(res, 400, { error: 'Invalid JSON' })
      }

      const { id, title, author, price } = book
      if (id === undefined || !title || !author || price === undefined) {
        return sendJSON(res, 400, {
          error: 'id, title, author and price are required'
        })
      }
      if (books.some(b => b.id === id)) {
        return sendJSON(res, 409, { error: 'Book with this id already exists' })
      }

      const newBook = { id, title, author, price }
      books.push(newBook)
      sendJSON(res, 201, { message: 'Book added successfully', book: newBook })
    })
    return
  }

  // Everything else -> 404
  sendJSON(res, 404, { error: 'Route not found' })
})

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`)
})
