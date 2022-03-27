const mongoose = require('mongoose');

mongoose.connection.on('connected', () => {
  console.log('MongoDB testing DB has connected successfully');
});

const connectToTestingDatabase = async () => {
  await mongoose.connect(process.env.MONGODB_DATABASE_TEST_URI, {
    keepAlive: true,
    keepAliveInitialDelay: 300000,
  }, null);
};

const clearCollection = async (collectionName) => {
  await mongoose.connection.dropCollection(collectionName);
};

const disconnectFromTestingDatabase = async () => {
  await mongoose.disconnect();
};

const dropTestingDatabase = async () => {
  await mongoose.connection.dropDatabase();
};

module.exports = {
  connectToTestingDatabase,
  disconnectFromTestingDatabase,
  dropTestingDatabase,
  clearCollection,
};
