import { useState, useEffect, useRef } from 'react'

function App() {
  const [book, setBook] = useState(null)
  const [error, setError] = useState(null)
  const [highlights, setHighlights] = useState([])
  const contentRef = useRef(null)

  // Load the book
  useEffect(() => {
    fetch('http://localhost:4000/api/books/sample')
      .then(res => res.json())
      .then(data => setBook(data))
      .catch(err => setError(err.message))
  }, [])

  // Load previously saved highlights
  useEffect(() => {
    fetch('http://localhost:4000/api/highlights')
      .then(res => res.json())
      .then(data => setHighlights(data))
      .catch(err => console.error('Failed to load highlights:', err))
  }, [])

  function handleMouseUp() {
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed) return

    const selectedText = selection.toString()
    if (!selectedText.trim()) return

    const range = selection.getRangeAt(0)
    const preRange = range.cloneRange()
    preRange.selectNodeContents(contentRef.current)
    preRange.setEnd(range.startContainer, range.startOffset)
    const start = preRange.toString().length
    const end = start + selectedText.length

    // Save to backend
    fetch('http://localhost:4000/api/highlights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ start, end })
    })
      .then(res => res.json())
      .then(newHighlight => {
        setHighlights(prev => [...prev, newHighlight])
      })
      .catch(err => console.error('Failed to save highlight:', err))

    selection.removeAllRanges()
  }

  function renderHighlightedContent() {
    if (!book) return null
    const text = book.content
    if (highlights.length === 0) return text

    const sorted = [...highlights].sort((a, b) => a.start - b.start)
    const parts = []
    let cursor = 0

    sorted.forEach((h) => {
      if (h.start > cursor) {
        parts.push(text.slice(cursor, h.start))
      }
      parts.push(
        <mark key={h.id} style={{ backgroundColor: '#ffe08a' }}>
          {text.slice(h.start, h.end)}
        </mark>
      )
      cursor = Math.max(cursor, h.end)
    })

    if (cursor < text.length) {
      parts.push(text.slice(cursor))
    }
    return parts
  }

  if (error) return <div style={{ padding: '2rem' }}>Error: {error}</div>
  if (!book) return <div style={{ padding: '2rem' }}>Loading...</div>

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem', fontFamily: 'Georgia, serif', lineHeight: '1.6' }}>
      <h1>{book.title}</h1>
      <pre
        ref={contentRef}
        onMouseUp={handleMouseUp}
        style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', cursor: 'text' }}
      >
        {renderHighlightedContent()}
      </pre>
    </div>
  )
}

export default App