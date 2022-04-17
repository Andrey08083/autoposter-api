const { Schema, model } = require('mongoose');

const integrationSchema = new Schema({
  workspace: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
  integrationType: { type: String, enum: ['Telegram'], required: true },
  integrationData: { type: Object, required: true, default: {} },
});

module.exports = model('Integration', integrationSchema);
