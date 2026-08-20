import { useState, useEffect } from 'react'

function App() {
  const [status, setStatus] = useState('checking...')

  useEffect(() => {
    fetch('http://localhost:4000/api/health')
      .then(res => res.json())
      .then(data => setStatus(data.message))
      .catch(err => setStatus('Error connecting to backend: ' + err.message))
  }, [])

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Book Annotation Platform</h1>
      <p>Backend status: {status}</p>
    </div>
  )
}

export default App