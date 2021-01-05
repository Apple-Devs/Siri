module.exports = {
  name: "createInviteLink",
  createInviteLink(message) {
    message.channel.createInvite()
      .then(invite => message.channel.send(`https://discord.gg/${invite.code}`))
      .catch(console.error);
  }
}