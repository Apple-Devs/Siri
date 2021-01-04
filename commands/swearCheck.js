module.exports = {
    name: "swearCheck",
    execute(message, checkForSwearWords) {
        if (/*message.author.tag == "Tusshar#3024" ||*/ message.author.tag == "Raspuutin#1629"){
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
    }
}