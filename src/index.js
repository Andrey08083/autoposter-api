require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const { connectToMongoDb } = require('./database/connector');
const { USER, TOKEN } = require('./constants/routes');
const userRouter = require('./routes/userRoutes');
const tokenRouter = require('./routes/tokenRoutes');
const { errorHandlerMiddleware } = require('./middlewares/errorHandlerMiddleware');

const app = express();

connectToMongoDb().then((value) => {
  if (value) {
    app.listen(process.env.API_PORT, () => {
      console.log(`Listening on ${process.env.API_PORT}`);
    });
  }
});

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

app.use(USER.USER_ROUTER, userRouter);

// NOTE: SHOULD BE EXPOSED ONLY IN TEST ENVIRONMENT
if (process.env.NODE_ENV === 'test') {
  app.use(TOKEN.TOKEN_ROUTER, tokenRouter);
}

app.use(errorHandlerMiddleware);
module.exports = app;
