import { useState, useEffect } from 'react'

function App() {
  const [book, setBook] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('http://localhost:4000/api/books/sample')
      .then(res => res.json())
      .then(data => setBook(data))
      .catch(err => setError(err.message))
  }, [])

  if (error) return <div style={{ padding: '2rem' }}>Error: {error}</div>
  if (!book) return <div style={{ padding: '2rem' }}>Loading...</div>

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem', fontFamily: 'Georgia, serif', lineHeight: '1.6' }}>
      <h1>{book.title}</h1>
      <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
        {book.content}
      </pre>
    </div>
  )
}

export default App