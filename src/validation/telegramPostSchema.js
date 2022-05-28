const joi = require('joi');
const dayjs = require('dayjs');

dayjs.extend(require('dayjs/plugin/utc'));

const validateTimeStamp = (value, helpers) => {
  // Adding two minutes just in case
  const currentTimeStamp = dayjs()
    .utc()
    .second(120)
    .millisecond(0)
    .valueOf();

  if (value < currentTimeStamp) {
    return helpers.error();
  }

  return value;
};

const telegramPostSchema = joi.object({
  postText: joi.string().required().max(1000),
  channelId: joi.number().required(),
  buttons: joi.array().items(
    joi.object({
      text: joi.string().required(),
      url: joi.string().required(),
    }),
  ),
});

const telegramPostScheduleSchema = joi.object({
  postText: joi.string().required().max(1000),
  channelId: joi.number().required(),
  sendAt: joi.number()
    .label('sendAtValidation')
    .required()
    .custom(validateTimeStamp),
  buttons: joi.array().items(
    joi.object({
      text: joi.string().required(),
      url: joi.string().required(),
    }),
  ),
});

module.exports = {
  telegramPostSchema,
  telegramPostScheduleSchema,
};
