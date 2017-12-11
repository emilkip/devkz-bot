const responseMessages = require('./responseMessages');

module.exports = {
  env: process.env.NODE_ENV || 'development',
  appName: 'devkz-bot',
  url: process.env.APP_URL || `https://${process.env.HEROKU_APP_NAME}.herokuapp.com:443`,
  chatId: process.env.CHAT_ID,
  adminId: process.env.ADMIN_ID,
  token: process.env.BOT_TOKEN,

  production: {
    bot: {
      options: {
        webHook: {
          port: process.env.PORT
        }
      }
    },
    db: {
      url: `mongodb://${process.env.MONGODB_USERNAME}:` +
            `${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:` +
            `${process.env.MONGODB_PORT}/${process.env.MONGODB_DB}`
    }
  },
  development: {
    bot: {
      options: {
        polling: true
      }
    },
    db: {
      url: 'mongodb://localhost/devkz_bot'
    }
  },

  maxAvailableMessagesCount: 5
};
