const { Message } = require("discord.js")

module.exports = {
    name: "ping",
    execute(message) {
        message.channel.send('69ms');
    }
}