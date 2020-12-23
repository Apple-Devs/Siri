const Discord = require("discord.js");
const { isMainThread } = require("worker_threads");

const fs = require("fs");

var greetings = fs.readFileSync("greetings.txt");
var greetArr = greetings.toString("utf8").split("\n");

var commands = fs.readFileSync("commands.txt");
var commandArr = commands.toString("utf8").split("\n");

var searchCommands = fs.readFileSync("search commands.txt");
var searchCommandArr = searchCommands.toString("utf8").split("\n");

const client = new Discord.Client();

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", (message) => {
  if (message.author.bot || message.channel.type === "dm") return;
  var args = message.content.split(/ +/);
  var revArgs = message.content.split(/ +/).reverse();
  var operation = "";
  var operationsPositionInTheMessage;
  var searchEngine;
  var object = "";
  var onOperationsPositionInTheMessage = 0;
  var b;

  function checkGreeting() {
    for (let i = 0; i < greetArr.length; i++) {
      for (let j = 0; j < args.length; j++) {
        if (greetArr[i] == args[j]) {
          for (let k = 0; k < args.length; k++) {
            if (args[k] == "siri") {
              return true;
            }
          }
        }
      }
    }
  }

  function checkOperation() {
    for (let i = 0; i < commandArr.length; i++) {
      for (let j = 0; j < args.length; j++) {
        if (commandArr[i] == args[j]) {
          operation = commandArr[i];
          operationsPositionInTheMessage = j;
          return true;
        }
      }
    }
  }

  function checkPositionOfSearchMessage() {
    for (let i = 0; i < commandArr.length; i++) {
      for (let j = 0; j < args.length; j++) {
        if (args[j] == "for") {
          forOperation = commandArr[i];
          forOperationsPositionInTheMessage = j;
          object = args[forOperationsPositionInTheMessage - 1];
          var searchThings = args;

          return true;
        } else if (revArgs[j] == "on") {
          onOperation = commandArr[i];
          onOperationsPositionInTheMessage = j;
          object = args[onOperationsPositionInTheMessage + 1];
          return true;
        }
      }
    }
  }

  function ping() {
    message.channel.send("69ms");
  }

  function searchTheSearch() {
    for (let i = 0; i < searchCommandArr.length; i++) {
      for (let j = 0; j < args.length; j++) {
        if (searchCommandArr[i] == args[j]) {
          searchEngine = args[j];
          console.log(
            `searched for the search engine. The search engine is ${searchEngine}`
          );
          return;
        }
      }
    }
  }

  function search() {
    console.log("does search work?");
    searchTheSearch();
    checkPositionOfSearchMessage();
    var linkargs = object.split(" ").join("&20");

    switch (searchEngine) {
      case "google":
        var googleLink = `https://google.com/search?q=${linkargs}`;
        message.channel.send(`I found this on the web \n${googleLink}`);
        break;
      case "spotify":
        var spotifyLink = `https://open.spotify.com/search/${linkargs}`;
        message.channel.send(`I found this on the web \n${spotifyLink}`);
        break;
      case "youtube":
        var ytLink = `https://youtube.com/results?search_query=${linkargs}`;
        message.channel.send(`I found this on the web \n${ytLink}`);
        break;
      case "apple music":
        var appleMusicLink = `https://music.apple.com/us/search?term=${linkargs}`;
        message.channel.send(`I found this on the web \n${appleMusicLink}`);
        break;
    }
  }

  // mute function
  function mute() {
    if (message.member.hasPermission("MANAGE_ROLES")) {
      var targetUser = message.mentions.users.first();
      if (!targetUser) {
        message.reply("Please select someone to mute");
        return;
      }

      args.shift();

      const roleName = "Muted";
      const { guild } = message;
      const role = guild.roles.cache.find((role) => {
        return role.name === roleName;
      });

      if (!role) {
        message.reply(`There is no role with the name "${roleName}"`);
        return;
      }
      const member = guild.members.cache.get(targetUser.id);
      member.roles.add(role);

      message.reply(`${message.mentions.users.first()} has now been muted.`);
    } else {
      message.reply("You don't have permission to mute others");
    }
  }

  // unmute function
  function unmute() {
    if (message.member.hasPermission("MANAGE_ROLES")) {
      if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
        message.reply("I don't have permission to manage roles");
        return;
      }

      var targetUser = message.mentions.users.first();
      if (!targetUser) {
        message.reply("Please select someone to mute");
        return;
      }

      args.shift();

      const roleName = "Muted";
      const { guild } = message;
      const role = guild.roles.cache.find((role) => {
        return role.name === roleName;
      });

      if (!role) {
        message.reply(`There is no role with the name "${roleName}"`);
        return;
      }
      const member = guild.members.cache.get(targetUser.id);

      if (member.roles.cache.get(role.id)) {
        member.roles.remove(role);
        message.reply(`${message.mentions.users.first()} has now been unmuted`);
      } else {
        message.reply(`${message.mentions.users.first()} is already unmuted`);
      }
    } else {
      message.reply("You don't have permission to unmute others");
    }
  }

  // Ban function
  function ban() {
    if (message.member.hasPermission("BAN_MEMBERS")) {
      if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
        message.reply("I don't have permission to manage roles");
        return;
      }

      var userToBan = message.mentions.users.first();
      if (!userToBan) {
        message.reply("Please select a user from this server to ban");
        return;
      }

      var { guild } = message;

      if (!guild.member(userToBan)) {
        message.reply("You need to provide a valid user");
        return;
      }

      guild.members
        .ban(userToBan.id)
        .then(() =>
          message.channel.send(
            `Banned ${userToBan.username} from ${guild.name}`
          )
        )
        .catch(console.error);
    } else {
      message.reply("you don't have permission to ban members");
      return;
    }
  }

  // Clear command
  function clear(numberOfMessagesToBeCleared) {
    if (!message.member.hasPermission("MANAGE_MESSAGES"))
      return message.reply("You don't have permission to manage messages");
    if (!message.guild.me.hasPermission("MANAGE_MESSAGES"))
      return message.reply("I don't have permission to manage messages");

    if (!numberOfMessagesToBeCleared) {
      message.reply("Please provide number of messages to be deleted.");
      return;
    }
    numberOfMessagesToBeCleared = parseFloat(numberOfMessagesToBeCleared);
    numberOfMessagesToBeCleared = Math.round(numberOfMessagesToBeCleared);
    message.channel
      .bulkDelete(numberOfMessagesToBeCleared)
      .then((messages) => {
        console.log(`Bulk Deleted ${messages.size} messages`);
      })
      .catch(console.err);
  }

  function kick() {
    if (!message.member.hasPermission("KICK_MEMBERS")) {
      message.reply("You have no permissions to do that");
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

  function convertInt() {
    var a = message.content.match(/\d+/g);
    for (var i = 0; i < a.length; a++) {
      b = parseInt(a[i]);
      console.log(typeof(b));
    }
  }

  const siriGreeting = `Hi ${message.author.username}, I am Siri, your personal virtual assistant. How may I help you?`;

  if (checkGreeting() && !checkOperation()) {
    message.channel.send(siriGreeting);
  }

  if (checkOperation() && checkGreeting()) {
    // switch(operation) {
    //   case 'ping':
    //     ping();
    //     break;
    //   case 'search':
    //     ping();
    //     break;

    // }

    if (operation == "ping") {
      ping();
    } else if (operation == "search") {
      search();
    } else if (operation == "mute") {
      mute();
    } else if (operation == "unmute") {
      unmute();
    } else if (operation == "ban") {
      ban();
    } else if (operation == "clear") {
       
      convertInt();
      clear(b);
      console.log(b);
    } else if (operation == "kick") {
      kick();
    }
  }
});

const config = require("./config.json");
client.login(config.token);
