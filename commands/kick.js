module.exports = {
  name: "kick",
  kick(message) {
    if (!message.member.hasPermission("KICK_MEMBERS")) {
      message.reply("You don't have permission to Kick Members!");
      return;
    }

    let mentionMember = message.mentions.members.first();

    if (!mentionMember) {
      message.reply("Please mention member which you need to kick");
      return;
    }

    if (!mentionMember.kickable) {
      message.channel.send("I have no permissions to kick this user");
      return;
    }

    mentionMember
      .kick()
      .then(() => {
        console.log(`Kicked ${mentionMember}`);
        message.channel.send(`Kicked ${mentionMember}`);
      })
      .catch(console.error);
  }
}