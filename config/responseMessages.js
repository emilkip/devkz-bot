
module.exports = {
  BOT_KICK_MESSAGE: 'Вали отсюда! Я единственный бот на районе!',
  FLOODER_RESTRICT_MESSAGE: 'Помолчи 5 минут - ',
  DB_ERROR_MESSAGE: 'Что-то пошло не так...',
  TOP_FLOODERS_FOR_MONTH: 'Топ флудеров за месяц (количество сообщений)',
  TOP_FLOODERS_FOR_DAY: 'Топ флудеров за день (количество сообщений)',
  TOP_FLOODERS_ALL_TIME: 'Топ флудеров за всё время (количество сообщений)',
  EVENT: {
    ENTER_TITLE: 'Задайте заголовок',
    ENTER_DESCRIPTION: 'Задайте описание',
    ENTER_DATE: 'Задайте дату мероприятия',
    EVENT_ADDED: 'Мероприятие добавлено',
    UPCOMMING_EVENTS: 'Предстоящие мероприятия.',
    NO_UPCOMMING_EVENTS: 'Нет мероприятий на ближайшее время. Есть что анонсировать? Тогда пиши @emilkip',
    MORE_DETAILS: 'Для получения полной информации о мероприятии, нажмите кнопку с соответствующим номером.'
  },
  BOT_REPLY_MESSAGE_ON_TAGGING: 'Что тебе от меня нужно?',
  BOT_REPLY_MESSAGES: [
    'Ой все',
    'Даже не знаю, что сказать...',
    'Без комментариев',
    'Я тебе не сири, чтобы отвечать',
    'Индус, который меня создавал, не запрограммировал в меня возможность отвечать на вопросы',
    '...',
    'Meow',
    '404, Ответ не найден.',
    '随机文本'
  ],
  getBotRandomReplyMessage() {
    const replyArrLen = this.BOT_REPLY_MESSAGES.length;
    const randNum = Math.floor(Math.random() * replyArrLen - 1);
    return this.BOT_REPLY_MESSAGES[randNum];
  },
  getGreetingMessage(name, hasUsername) {
    return (
      `<b>Добро пожаловать</b> ${hasUsername ? '@' : ''}${name}.\n\n` +
      `Пожалуйста представьтесь и опишите род вашей деятельности.\n` +
      `Перед началом общения прочтите дисклеймер под этим сообщением.\n\n` +
      `Канал для вакансий: @devkz_jobs`
    );
  },
  MAINTAIN: {
    DB_CONNECTED: 'Connection to mongoDB established successfully',
    WEBHOOK_INSTALLED: 'WebHook installed successfully'
  }
};
