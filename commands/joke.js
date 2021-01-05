module.exports = {
  name: "joke",
  joke(jokesArr, message) {
    let randomJokeNumber = Math.floor(Math.random() * jokesArr.length + 1);
    message.channel.send(jokesArr[randomJokeNumber]);
  }
}