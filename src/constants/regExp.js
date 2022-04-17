module.exports = {
  mongoDbIdRegExp: /^[a-f\d]{24}$/i,
  connectTokenRegExp: /([a-f\d]{24})-([a-f\d]{24})-([a-f\d]{24})/i,
  removeHtmlTagsRegExp: /<\/?p[^>]*>/g,
};
