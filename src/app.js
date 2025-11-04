import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import animeRoutes from './routes/animeRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API Anime !' });
});

app.use('/animes', animeRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

export default app;
