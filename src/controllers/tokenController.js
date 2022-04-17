const tokenService = require('../services/tokenService');

const refreshUserToken = async (req, res, next) => {
  try {
    const token = await tokenService.refreshUserToken(req.token.refreshToken, req.user);
    res.send(token);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  refreshUserToken,
};
