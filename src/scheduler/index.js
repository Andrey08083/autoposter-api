const nodeCron = require('node-cron');
const dayjs = require('dayjs');
dayjs.extend(require('dayjs/plugin/utc'));

const telegramPostsService = require('../services/telegramPostService');

const sendScheduledPosts = async () => {
  const currentTimeStamp = dayjs()
    .utc()
    .second(0)
    .millisecond(0)
    .valueOf();

  const telegramPosts = await telegramPostsService.find({ sendAt: currentTimeStamp });

  for (const telegramPost of telegramPosts) {
    await telegramPostsService.sendTelegramPost(telegramPost);
  }
};

const registerCronJob = () => {
  nodeCron.schedule('0 * * * * *', sendScheduledPosts, { scheduled: true });
  console.log('Scheduler was successfully registered');
};

module.exports = {
  registerCronJob,
};
