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
      url: `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/devkz_bot`
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

  maxAvailableMessagesCount: 5,

  messages: {
    BOT_KICK_MESSAGE: 'Вали отсюда! Я единственный бот на районе!',
    FLOODER_RESTRICT_MESSAGE: 'Помолчи 5 минут - ',
    BOT_REPLY_MESSAGE: 'Ой все',
    DB_ERROR_MESSAGE: 'Что-то пошло не так...',
    TOP_FLOODERS_FOR_MONTH: 'Топ флудеров за месяц (количество сообщений)',
    TOP_FLOODERS_FOR_DAY: 'Топ флудеров за день (количество сообщений)',
    TOP_FLOODERS_ALL_TIME: 'Топ флудеров за всё время (количество сообщений)'
  },

  getGreetingMessage: (name, hasUsername) => {
    return (
      `<b>Добро пожаловать</b> ${hasUsername ? '@' : ''}${name}.\n\n` +
      `Пожалуйста представьтесь и опишите род вашей деятельности.\n` +
      `Перед началом общения прочтите дисклеймер под этим сообщением.\n\n` +
      `Канал для вакансий: @devkz_jobs`
    );
  }
};
