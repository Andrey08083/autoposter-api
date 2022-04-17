const integrationModel = require('../models/integration');
const BaseService = require('./baseService');

class IntegrationService extends BaseService {
  async createTelegramIntegrationIfNotExists(workspaceId) {
    const existingIntegration = await this.model.findOne({
      workspace: workspaceId,
      integrationType: 'Telegram',
    });

    // Return existing if already exists
    if (existingIntegration) {
      return existingIntegration;
    }

    return this.model.create({
      workspace: workspaceId,
      integrationType: 'Telegram',
    });
  }
}

module.exports = new IntegrationService(integrationModel);
