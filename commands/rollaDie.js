module.exports = {
  name: "rollaDie",
  rollaDie(message) {
    let dieRoll = Math.floor(Math.random() * 6) + 1;
    message.channel.send("I rolled a die and the result was \n|| " + dieRoll + " ||");
  }
}