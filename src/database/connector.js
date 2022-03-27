const mongoose = require('mongoose');

const connectToMongoDb = async () => {
  if (process.env.NODE_ENV === 'test') return false;
  await mongoose.connect(process.env.MONGODB_DATABASE_URI, {
    keepAlive: true,
    keepAliveInitialDelay: 300000,
  }, null);
  return true;
};

if (process.env.NODE_ENV !== 'test') {
  mongoose.connection.on('connected', () => {
    console.log('MongoDB has connected successfully');
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB has connection error', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected!');
    connectToMongoDb();
  });
}

module.exports = {
  connectToMongoDb,
};
