const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");

let greetingsArr, commandsArr, searchCommandsArr, jokesArr, swearWordsArr;

convertFileToArray = filePath => {
  let arrayName = fs.readFileSync(filePath).toString("utf8").split("\n");
  return arrayName;
}

greetingsArr = convertFileToArray("greetings.txt")
commandsArr = convertFileToArray("commands.txt")
searchCommandsArr = convertFileToArray("searchCommands.txt")
jokesArr = convertFileToArray("jokes.txt")
swearWordsArr = convertFileToArray("swearWords.txt")

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", (message) => {
  if (message.author.bot || message.channel.type === "dm") return;
  let punctuationLess = message.content.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
  let finalString = punctuationLess.replace(/\s{2,}/g," ");
  message.content = finalString;

  let args = message.content.split(/ +/);
  let revArgs = message.content.split(/ +/).reverse();
  let operation, object, searchEngine;
  let operationsPositionInTheMessage;
  let onOperationsPositionInTheMessage = 0;
  let b;
  console.log(greetingsArr);
  console.log(args);


  checkGreeting = () => {
    for (let i = 0; i < greetingsArr.length; i++) {
      for (let j = 0; j < args.length; j++) {
        if (greetingsArr[i] == args[j]) {
          for (let k = 0; k < args.length; k++) {
            if (args[k] =="siri") {
              console.log("true hai")
              return true;
            }
          }
        }
      }
    }
  }

  

  checkForSwearWords = () => {
    for (let i = 0; i < swearWordsArr.length; i++) {
      for (let j = 0; j < args.length; j++) {
        if (swearWordsArr[i] == args[j]) {
          return true;
        }
      }
    }
  }


  swearCheck = () => {
    if (message.author.tag == "Tusshar#3024" || message.author.tag == "Raspuutin#1629"){
      return;
    } else {
      checkForSwearWords();
      if (checkForSwearWords()) {
        message.channel.bulkDelete(1);
        message.reply('You have been muted for using a swear word so stfu');
        
        const roleName = "Muted";
        const { guild } = message;
        const role = guild.roles.cache.find((role) => {
          return role.name === roleName;
        });
        guild.members.cache.get(message.author.id).roles.add(role);

        return;
      }
    }
};

  checkOperation = () => {
    for (let i = 0; i < commandsArr.length; i++) {
      for (let j = 0; j < args.length; j++) {
        if (commandsArr[i] == args[j]) {
          operation = commandsArr[i];
          operationsPositionInTheMessage = j;
          return true;
        }
      }
    }
  }

  checkPositionOfSearchMessage = () => {
    for (let i = 0; i < commandsArr.length; i++) {
      for (let j = 0; j < args.length; j++) {
        if (args[j] == "on") {
          forOperation = commandsArr[i];  
          forOperationsPositionInTheMessage = j;
          object = args[forOperationsPositionInTheMessage - 1];

          return true;
        } else if (revArgs[j] == "for") {
          onOperation = commandsArr[i];
          onOperationsPositionInTheMessage = j;
          object = args[onOperationsPositionInTheMessage + 1];
          return true;
        }
      }
    }
  }

  ping = () => {
    message.channel.send("69ms");
  }

  searchTheSearch = () => {
    for (let i = 0; i < searchCommandsArr.length; i++) {
      for (let j = 0; j < args.length; j++) {
        
        let searchStr = "";
        searchStr += args[j];
        searchStr += " ";
        searchStr += args[j+1];
        console.log(j)
        console.log(searchStr);

        if (searchCommandsArr[i] == searchStr) {
          searchEngine = args[j] + "\ " + args[j+1];
          console.log(
            `Searched for the search engine. The search engine is ${searchEngine}`
          );
          return;
        } else if (searchCommandsArr[i] == args[j]){
          searchEngine = args[j];
        console.log(
          `earched for the search engine. The search engine is ${searchEngine}`
        );
        return;
        }
      }
    }
  }

  search = () => {
    searchTheSearch();
    checkPositionOfSearchMessage();
    let linkargs = object.split(" ").join("&20");
    searchThis = (siteLink) => {
      message.channel.send("https://" + siteLink + linkargs)
    }
    switch (searchEngine) {
      case "google":
        searchThis("google.com/search?q=")
        break;
      case "spotify":
        searchThis("open.spotify.com/search/")
        break;
      case "youtube":
        searchThis("youtube.com/results?search_query")
        break;
      case "apple music":
        searchThis("music.apple.com/us/search?term=")
        break;
      case 'duckduckgo':
        searchThis("duckduckgo.com/?q=")
        break;
      case 'youtube music':
        searchThis("music.youtube.com/search?q=")
        break;
      case 'bing':
        searchThis("bing.com/search?q=")
        break;
    }
  }

  mute = () => {
    if (message.member.hasPermission("MANAGE_ROLES")) {
      let targetUser = message.mentions.users.first();
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

  unmute = () => {
    if (message.member.hasPermission("MANAGE_ROLES")) {
      if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
        message.reply("I don't have permission to manage roles");
        return;
      }

      let targetUser = message.mentions.users.first();
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

  ban = () => {
    if (message.member.hasPermission("BAN_MEMBERS")) {
      if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
        message.reply("I don't have permission to manage roles");
        return;
      }

      let userToBan = message.mentions.users.first();
      if (!userToBan) {
        message.reply("Please select a user from this server to ban");
        return;
      }

      let { guild } = message;

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

  clear = numberOfMessagesToBeCleared => {
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

  kick = () => {
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

  convertInt = () => {
    let a = message.content.match(/\d+/g);
    for (let i = 0; i < a.length; a++) {
      b = parseInt(a[i]);
      console.log(typeof(b));
    }
  }

  createInviteLink = () => {
    message.channel.createInvite()
      .then(invite => message.channel.send(`https://discord.gg/${invite.code}`))
      .catch(console.error);
  }

  rollaDie = () => {
    let dieRoll = Math.floor(Math.random() * 6) + 1;
    message.channel.send("I rolled a die and the result was \n|| " + dieRoll + " ||");
  }

  joke = () => {
    let randomJokeNumber = Math.floor(Math.random() * jokesArr.length + 1);
    message.channel.send(jokesArr[randomJokeNumber]);
  }

  time = () => {

    for (let i = 0; i < args.length; i++) {
      if (args[i].toLowerCase() == 'time') {
        let currentdate = new Date(); 
        let datetime = "```The time is: " + currentdate.getDate() + "/"
                    + (currentdate.getMonth()+1)  + "/" 
                    + currentdate.getFullYear() + " @ "  
                    + currentdate.getHours() + ":"  
                    + currentdate.getMinutes() + ":" 
                    + currentdate.getSeconds() + "```";
        console.log(datetime)
        message.channel.send(datetime);
      }
    }
  }

  swearCheck();

  const siriGreeting = `Hi ${message.author.username}, I am Siri, your personal virtual assistant. How may I help you?`;

  if (checkGreeting() && !checkOperation()) {
    message.channel.send(siriGreeting);
  }

  if (checkOperation() && checkGreeting()) {

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
    } else if (operation == 'invite') {
      createInviteLink();
    } else if (operation == 'rolladie') {
      rollaDie();
    } else if (operation == "joke" || operation == "pun") {
      joke();
    } else if (operation == 'time') {
      time();
    }
  }

});


const config = require("./config.json");
client.login(config.token);
