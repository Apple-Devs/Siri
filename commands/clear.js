module.exports = {
  name: "clear",
  clear(message, numberOfMessagesToBeCleared) {
    if (!message.member.hasPermission("MANAGE_MESSAGES"))
      return message.reply("You don't have permission to manage messages");
    if (!message.guild.me.hasPermission("MANAGE_MESSAGES"))
      return message.reply("I don't have permission to manage messages");

    let user = message.guild.member(message.mentions.users.first());
    if (!numberOfMessagesToBeCleared) {
      message.reply("Please provide number of messages to be deleted.");
      return;
    }
    numberOfMessagesToBeCleared = parseFloat(numberOfMessagesToBeCleared);
    numberOfMessagesToBeCleared = Math.round(numberOfMessagesToBeCleared);
    numberOfMessagesToBeCleared = parseInt(numberOfMessagesToBeCleared);

    if (!user) {
      message.channel
        .bulkDelete(numberOfMessagesToBeCleared)
        .then((messages) => {
          message.channel.send(` Cleared ${messages.size} messages`).then(message => {
            message.delete(2000);
          });
          console.log(`Bulk Deleted ${messages.size} messages`);
        })
        .catch(console.err);
    } else {
      message.channel.messages.fetch()
      .then((messages) => {
        messages = messages.filter(m => m.author.id === user.id).array().slice(0, numberOfMessagesToBeCleared/2);
        message.channel.bulkDelete(messages)
        .then((messages) => {
          message.channel.send(` Cleared ${messages.size} messages by ${user}`).then(message => {
            message.delete(2000);
          });
          console.log(` Cleared ${messages.size} messages by ${user}`);
        } )
        .catch(error => console.log(error.stack));
      }).catch(console.error);

    }
  },
}