const { Message } = require("discord.js")

module.exports = {
    name: "ping",
    execute() {
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
}