const tokenService = require('../services/tokenService');

const refreshUserToken = async (req, res) => {
  const token = await tokenService.refreshUserToken(req.token.refreshToken, req.user);
  return res.status().send(token);
};

module.exports = {
  refreshUserToken,
};
