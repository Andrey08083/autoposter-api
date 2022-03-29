const { Schema, model } = require('mongoose');

const integrationSchema = new Schema({
  workspace: { type: Schema.Types.ObjectId, ref: 'Workspace' },
  integrationType: String,
  integrationData: Object,
});

module.exports = model('Integration', integrationSchema);
