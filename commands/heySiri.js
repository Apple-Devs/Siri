module.exports = {
    name: "heySiriCheck",
    checkOperation(commandsArr, args, operation) {
        for (let i = 0; i < commandsArr.length; i++) {
            for (let j = 0; j < args.length; j++) {
              if (commandsArr[i] == args[j]) {
                operation = commandsArr[i];
                return operation;
              }
            }
          }
          return false;
    },
    checkGreeting(greetingsArr, args) {
        for (let i = 0; i < greetingsArr.length; i++) {
            for (let j = 0; j < args.length; j++) {
              if (greetingsArr[i] == args[j]) {
                for (let k = 0; k < args.length; k++) {
                  if (args[k] =="siri") {
                    return true;
                  }
                }
              }
            }
          }
    }
}