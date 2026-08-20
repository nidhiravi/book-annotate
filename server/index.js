import express from 'express';
import cors from 'cors';
import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const highlightsFilePath = join(__dirname, 'highlights.json');

async function readHighlights() {
  try {
    const data = await readFile(highlightsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    // File doesn't exist yet — that's fine, means no highlights saved so far
    return [];
  }
}

async function writeHighlights(highlights) {
  await writeFile(highlightsFilePath, JSON.stringify(highlights, null, 2));
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is alive' });
});

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

app.get('/api/highlights', async (req, res) => {
  const highlights = await readHighlights();
  res.json(highlights);
});

app.post('/api/highlights', async (req, res) => {
  const { start, end } = req.body;
  const highlights = await readHighlights();
  const newHighlight = { id: Date.now(), start, end };
  highlights.push(newHighlight);
  await writeHighlights(highlights);
  res.json(newHighlight);
});

app.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});