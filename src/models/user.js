const { Schema, model } = require('mongoose');

const settingsSchema = new Schema({
  timeZone: String,
});

const userSchema = new Schema({
  email: { type: String, index: { unique: true }, required: true },
  userName: { type: String, required: true },
  password: { type: String, required: true },
  resetPasswordToken: { type: String, required: false, default: null },
  settings: settingsSchema,
}, {
  toJSON: {
    transform: (doc, ret) => {
      const userClone = { ...ret };
      userClone._id = userClone._id.toString();
      delete userClone.password;
      delete userClone.confirmationCode;
      delete userClone.resetPasswordToken;
      delete userClone.__v;
      return userClone;
    },
  },
});

module.exports = model('User', userSchema);
