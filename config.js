
module.exports = {
  env: process.env.NODE_ENV || 'development',
  appName: 'devkz-bot',
  chatId: -1001075169847,
  url: process.env.APP_URL || `https://${process.env.HEROKU_APP_NAME}.herokuapp.com:443`,
  token: process.env.BOT_TOKEN,
  bot: {
    production: {
      options: {
        webHook: {
            port: process.env.PORT
        }
      }
    },
    development: {
      options: {
          polling: true
      }
    }
  },

  maxAvailableMessagesCount: 5,

  messages: {
    botKickMessage: 'Вали отсюда! Я единственный бот на районе!',
    flooderRestrictMessage: 'Помолчи 5 минут - ',
    botReplyMessage: 'Ой все'
  },

  getGreetingMessage: (name, hasUsername) => {
    return (
      `<b>Добро пожаловать</b> ${hasUsername ? '@' : ''}${name}.\n\n` +
      `Перед началом общения прочтите дисклеймер под этим сообщением.\n\n` +
      `Если вы пришли сюда оставить вакансию, то для этого есть специальный канал: @devkz_jobs`
    );
  }
};
