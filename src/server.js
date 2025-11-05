import dotenv from 'dotenv';
import app from './app.js';
import { connectToDatabase } from './config/database.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/anime_db';

async function startServer() {
  try {
    await connectToDatabase(MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
