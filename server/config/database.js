import mongoose from 'mongoose';

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://admin:mzh8441@civic-platform.4xmfl4f.mongodb.net/?retryWrites=true&w=majority&appName=civic-platform';
const DB_NAME = 'SahiSamasya';

// Connect to MongoDB
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});
