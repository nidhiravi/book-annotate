import express from 'express';
import cors from 'cors';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/books/sample', async (req, res) => {
  try {
    const filePath = join(__dirname, 'books', 'sample.txt');
    const raw = await readFile(filePath, 'utf-8');

    const startMarker = /\*\*\* START OF THE PROJECT GUTENBERG EBOOK.*\*\*\*/i;
    const endMarker = /\*\*\* END OF THE PROJECT GUTENBERG EBOOK.*\*\*\*/i;

    const startMatch = raw.match(startMarker);
    const endMatch = raw.match(endMarker);

    let content = raw;
    if (startMatch && endMatch) {
      const startIndex = startMatch.index + startMatch[0].length;
      const endIndex = endMatch.index;
      content = raw.slice(startIndex, endIndex).trim();
    }

    res.json({ title: 'The Gift of the Magi', content });
  } catch (err) {
    res.status(500).json({ error: 'Could not read book file', details: err.message });
  }
});

app.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});