import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is alive' });
});

app.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});