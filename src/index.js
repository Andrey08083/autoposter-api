require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const { connectToMongoDb } = require('./database/connector');
const {
  USER,
  TOKEN,
  WORKSPACE,
} = require('./constants/routes');
const userRouter = require('./routes/userRoutes');
const tokenRouter = require('./routes/tokenRoutes');
const workspaceRouter = require('./routes/workspaceRoutes');
const { errorHandlerMiddleware } = require('./middlewares/errorHandlerMiddleware');

const app = express();
require('./bot');

connectToMongoDb().then((isProduction) => {
  if (isProduction) {
    app.listen(process.env.API_PORT, () => {
      console.log(`Listening on ${process.env.API_PORT}`);
    });
  } else {
    console.log(`Environment: ${process.env.NODE_ENV}. Server not started`);
  }
});

app.use('*', cors());

app.use(logger('dev'));
app.use(express.json());

app.use(USER.USER_ROUTER, userRouter);

app.use(WORKSPACE.WORKSPACE_ROUTER, workspaceRouter);

// NOTE: SHOULD BE EXPOSED ONLY IN TEST ENVIRONMENT
if (process.env.NODE_ENV === 'test') {
  app.use(TOKEN.TOKEN_ROUTER, tokenRouter);
}

app.use(errorHandlerMiddleware);
module.exports = app;
