const swearCheck = require("./swearCheck");

module.exports = {
    name: "checkGreetingForSwearWords",
    execute(swearWordsArr, args) {
        for (let i = 0; i < swearWordsArr.length; i++) {
            for (let j = 0; j < args.length; j++) {
              if (swearWordsArr[i] == args[j]) {
                console.log(args[j])
                return true;
              }
            }
          }
    }
}