const configs = require('../config/config');


module.exports = {

  isCurrentChat: (chatId) => (chatId === parseInt(configs.chatId)),

  isAdminChat: (chatId) => (chatId === parseInt(configs.adminId)),

  isAdmin: (userId) => (userId === parseInt(configs.adminId)),

  countMessage: (message, usersMessages) => {
    if (!usersMessages[message.from.id]) {
      usersMessages[message.from.id] = {
        username: message.from.username || `${message.from.first_name || ''} ${message.from.last_name || ''}`,
        count: 0,
        messages: []
      }
    }
    const currentUser = usersMessages[message.from.id];

    if (currentUser.count !== 0) {
      const messageTimeDiff = Math.abs(currentUser.messages[0].date - message.date);

      if (messageTimeDiff > 3) return usersMessages;
    }

    ++currentUser.count;
    currentUser.messages.push(message);

    return usersMessages;
  }

}
