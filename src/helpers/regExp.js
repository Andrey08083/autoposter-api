/**
 * @param {RegExp} regExp
 * @param {String} text
 */
const getMatchesFromRegExp = (regExp, text) => {
  return regExp.exec(text).slice(1);
};

module.exports = {
  getMatchesFromRegExp,
};
