require('dotenv').config();

process.env.NODE_ENV = 'test';
const { connectToTestingDatabase } = require('./testUtils');

connectToTestingDatabase();
