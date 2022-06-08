const { Schema, model } = require('mongoose');

const { USER } = require('../constants/userRoles');

const userSchema = new Schema({
  email: { type: String, index: { unique: true }, required: true },
  userName: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: USER },
}, {
  toJSON: {
    transform: (doc, ret) => {
      const userClone = { ...ret };
      userClone._id = userClone._id.toString();
      delete userClone.password;
      delete userClone.__v;
      return userClone;
    },
  },
});

module.exports = model('User', userSchema);
