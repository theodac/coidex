import mongoose from 'mongoose';

export async function connectToDatabase(uri) {
  if (!uri) {
    throw new Error('MongoDB connection string is not defined. Set MONGODB_URI.');
  }

  mongoose.set('strictQuery', false);

  return mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
