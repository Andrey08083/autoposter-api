module.exports = {
  USER: {
    USER_ROUTER: '/user',
    REGISTRATION: '/register',
    LOGIN: '/login',
    LOGOUT_USER: '/logout',
    REFRESH_USER_TOKEN: '/refresh',
    GET_USER: '/',
    UPDATE_USER: '/update',
    VERIFY_USER_ACCOUNT: '/verify',
  },
  WORKSPACE: {
    WORKSPACE_ROUTER: '/workspace',
    GET_WORKSPACE: '/',
  },
  TELEGRAM: {
    TELEGRAM_ROUTER: '/telegram',
    GET_TELEGRAM_CHANNELS: '/channels',
    CONNECT_TELEGRAM: '/connect',
  },
  POSTS: {
    POSTS_ROUTER: '/posts',
    SEND_POST: '/sendPost',
    SCHEDULE_POST: '/schedule',
    SEND_POST_BY_ID: '/:postId/send',
    DELETE_POST_BY_ID: '/:postId',
  },
  TOKEN: {
    TOKEN_ROUTER: '/token',
    ACCESS_TOKEN: '/accessToken',
    REFRESH_TOKEN: '/refreshToken',
  },
  ADMIN: {
    ADMIN_ROUTER: '/admin',
    USERS: '/users',
    POSTS_BY_USER_ID: '/posts/:userId',
    CHANGE_USER_PASSWORD: '/changeUserPassword',
  },
};
