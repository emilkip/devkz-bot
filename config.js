
module.exports = {
  env: process.env.NODE_ENV || 'development',
  appName: 'devkz-bot',
  url: process.env.APP_URL || `https://${process.env.HEROKU_APP_NAME}.herokuapp.com:443`,
  chatId: process.env.CHAT_ID,
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
      `Пожалуйста представьтесь и опишите род вашей деятельности.\n` + 
      `Перед началом общения прочтите дисклеймер под этим сообщением.\n\n` +
      `Канал для вакансий: @devkz_jobs`
    );
  }
};
