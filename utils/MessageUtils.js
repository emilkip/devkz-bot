
module.exports = {

  countMessage: (message, usersMessages) => {
    if (!usersMessages[message.from.id]) {
      usersMessages[message.from.id] = {
        username: message.from.username || `${message.from.first_name || ''} ${message.from.last_name || ''}`,
        count: 0,
        messages: []
      }
    }
    ++usersMessages[message.from.id].count;
    usersMessages[message.from.id].messages.push(message.message_id);

    return usersMessages;
  }

}
