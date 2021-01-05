module.exports = {
  name: "convertInt",
  convertInt(message) {
    let a = message.content.match(/\d+/g);
    for (let i = 0; i < a.length; a++) {
      b = parseInt(a[i]);
      console.log(typeof(b));
      return b;
    }
  }
}