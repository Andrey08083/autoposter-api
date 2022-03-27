const { Schema, model } = require('mongoose');

const tokenSchema = new Schema({
  accessToken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, {
  toJSON: {
    transform: (doc, ret) => {
      const tokenClone = { ...ret };
      delete tokenClone._id;
      delete tokenClone.user;
      delete tokenClone.__v;
      return tokenClone;
    },
  },
});

module.exports = model('Token', tokenSchema);
