module.exports = {
  name: "time",
  time(args, message) {
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
}