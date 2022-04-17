const workspaceService = require('../services/workspaceService');

const getWorkspace = async (req, res, next) => {
  try {
    const workspace = await workspaceService.findOne({ user: req.user._id });

    res.send(workspace);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getWorkspace,
};
