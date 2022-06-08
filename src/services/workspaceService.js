const workspace = require('../models/workspace');
const BaseService = require('./baseService');

class WorkspaceService extends BaseService {
  getWorkspaceByUserId(userId) {
    return this.model.findOne({ user: userId });
  }
}

module.exports = new WorkspaceService(workspace);
