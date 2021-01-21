const Discord = require("discord.js");
const request = require("request");
const moment = require('moment');
const fs = require('fs');
const { openWeatherMapApiKey , weatherApiKey } = require('../APIkeys.json');
const { min } = require("moment");

module.exports = {
  commands: "current, dailyForcast",
  current(message, args) {
    let currentPos = args.indexOf( "current" ) ;
    let weatherPos = args.indexOf( "weather" ) ;

    if (weatherPos == -1 || weatherPos == undefined || weatherPos == null)
      return;

    if (currentPos+1 !== weatherPos)
      return;

    let locationName = args.join(" ").slice(args[currentPos].length + args[weatherPos].length + 2);

    if (!locationName) 
      return message.channel.send("Please provide a location");

    request(
      `http://api.weatherapi.com/v1/search.json?key=${weatherApiKey}&q=${locationName}`,
      { json: true },
      (err, res, searchRes) => {
        if (err) {
          message.channel.send('There was an error. Please try again later.');
          return console.log(err);
        }

        if (searchRes.length === 0 || searchRes == undefined || searchRes == null || searchRes[0].name == undefined)
          return message.channel.send('Location Not Found!');

        message.channel.send(`The top result for "${locationName}" is "${searchRes[0].name}"`);
        locationName = searchRes[0].name;


        var lat = searchRes[0].lat;
        var lon = searchRes[0].lon;
        var unitSystem = 'metric';

        request(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unitSystem}&appid=${openWeatherMapApiKey}`,
          { json: true },
          async (err, res, body) => {
            if (err) {
              message.channel.send('There was an error. Please try again later.');
              return console.log(err);
            }
            
            console.log(body);

            var iconId = body.weather[0].icon;
            var iconUrl = `http://openweathermap.org/img/wn/${iconId}@2x.png`;
            var locationTitle = body.name;
            var weatherDes = body.weather[0].description.split("");
            weatherDes[0] = weatherDes[0].toUpperCase();
            weatherDes =  weatherDes.join("");
            var temp = `${body.main.temp}°C`;
            var feelsLike = `${body.main.feels_like}°C`;
            var minTemp = `${body.main.temp_min}°C`;
            var maxTemp = `${body.main.temp_max}°C`;
            var pressure = `${body.main.pressure} hPa`;
            var humidity = `${body.main.humidity}%`;
            var windSpeed = `${body.wind.speed * 3.6} km/h`;
            var cloudPercent = `${body.clouds.all}%`;
            var sunriseTime = new Date(body.sys.sunrise * 1000).toLocaleString();
            var sunsetTime = new Date(body.sys.sunset * 1000).toLocaleString();

            var embed = new Discord.MessageEmbed()
              .setTitle(locationTitle)
              .setDescription(weatherDes)
              .setColor('#8c00ff')
              .setThumbnail(iconUrl)
              .addField('Temperature', temp, true)
              .addField('Feels Like', feelsLike, true)
              .addField('Minimum \nTemperature', minTemp, true)
              .addField('Maximum \nTemperature', maxTemp, true)
              .addField('Pressure', pressure, true)
              .addField('Humidity', humidity, true)
              .addField('Wind Speed', windSpeed, true)
              .addField('Cloud Percentage', cloudPercent, true)
              .addField('Sunrise', sunriseTime, true)
              .addField('Sunset', sunsetTime, true);

            await message.channel.send(embed);
          }
        )


      }
    )
    

  },
  async dailyForecast(message, args, client) {
    let dailyPos   = args.indexOf("daily"  ) ;
    let weatherPos = args.indexOf("weather") ;
    
    if (weatherPos == -1 || weatherPos == undefined || weatherPos == null)
      return;

    if (dailyPos+1 !== weatherPos)
      return;

    let locationName = args.join(" ").slice(args[dailyPos].length + args[dailyPos].length + 4);
    if (!locationName) 
      return message.channel.send("Please provide a location");


    request(
      `http://api.weatherapi.com/v1/search.json?key=${weatherApiKey}&q=${locationName}`,
      { json: true },
      async (err, res, searchRes) => {
        if (err) {
          message.channel.send('There was an error. Please try again later.');
          return console.log(err);
        }

        if (searchRes.length === 0 || searchRes == undefined || searchRes == null || searchRes[0].name == undefined)
          return message.channel.send('Location Not Found!');

        message.channel.send(`The top result for "${locationName}" is "${searchRes[0].name}"`);
        locationName = searchRes[0].name;


        var lat = searchRes[0].lat;
        var lon = searchRes[0].lon;
        var unitSystem = 'metric';
        var excludeParts = "current,minutely,hourly";

        request(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${unitSystem}&appid=${openWeatherMapApiKey}`,
          { json: true },
          async (err, res, body) => {
            if (err) {
              message.channel.send('There was an error. Please try again later.');
              return console.log(err);
            }

            let daily = body.daily;
            // console.log(body);

            // The area after this point is where we make the embed

            let sevenDayEmbed = new Discord.MessageEmbed()
              .setColor("#fff")
              .setTitle("Seven Day Weather Forecast")
              .setAuthor('Siri', client.user.displayAvatarURL(), 'https://www.apple.com/au/siri/')
              .setThumbnail("https://support.apple.com/library/content/dam/edam/applecare/images/en_US/iOS/ios10-weather-app-icon.png")
            // var serverID = "708987745262895124";
            var serverID = '800735590625968148'; // Weather Asset's Server
            var guild = client.guilds.cache.get(serverID);
            var remEmoArr = [];
            var remEmoIdArr = [];
            let daysArr = [];
            let popArr = [];
            let minArr = [];
            let maxArr = [];
            let idArr = [];

            

              // for (let i = 0; i < daily.length; i++) {
              //   var iconId = daily[i].weather[0].icon;
              //   // console.log(iconId);
              //   var iconURL = `http://openweathermap.org/img/wn/${iconId}.png`;
              //   console.log(iconURL);
              //   var emoName = "em" + i;
              //   let minTemp = Math.round(daily[i].temp.min).toString();
              //   let maxTemp = Math.round(daily[i].temp.max).toString();

              //   // console.log('starting emoji creation process...');
              //   var newEmo = await guild.emojis.create(iconURL, emoName);
              //   // console.log('created emoji');
                
              //   days.push(moment().add(i, 'days').format('dddd'));

              //   // console.log(days[i]);

              //   var str7day = `**\`${maxTemp}°C\`**
                
                
                
                
              //   \`${minTemp}°C\`\nHello line ${i}\n ${days[i]}`;
              //   sevenDayEmbed.addField(`<:${emoName}:${newEmo.id}>`, str7day, true);

              //   remEmoArr.push(newEmo);
              //   remEmoIdArr.push(newEmo.id.toString());
              // }
              
            for (let i = 0; i < daily.length; i++) {
              if (daily[i].pop) {
                popArr.push(`${body.daily[i].pop * 100} %`);
              } else {
                popArr.push(-1);
              }

              

              let minTemp = Math.round(daily[i].temp.min).toString() + "°";
              let maxTemp = Math.round(daily[i].temp.max).toString() + "°";
              let iconId = daily[i].weather[0].icon;
              let iconURL = `http://openweathermap.org/img/wn/${iconId}.png`;
              let emoName = "em" + i;
              console.log('Starting emoji creation process...');
              var newEmo = await guild.emojis.create(iconURL, emoName);
              console.log('Created Emoji');

              daysArr.push(moment().add(i, 'days').format('dddd'));
              minArr.push(minTemp);
              maxArr.push(maxTemp);
              idArr.push(`<:${emoName}:${newEmo.id}>`);
              remEmoArr.push(newEmo);
              remEmoIdArr.push(newEmo.id.toString());
            }

            // for (let i = 0; i < daysArr.length; i++) {
              
            // }

              var embedStr = "";
              var embedTitle;
              let tempTitle;
              let tempStr = "";
              let emojiTitle;
              let emojiStr = "";
              let spaces;
            
            for (let i = 0; i < daysArr.length; i++) {
              if (i == 0) {
                embedTitle = `${daysArr[i]}`;
              } else {
                embedStr += `\n${daysArr[i]}\n`;
              }

              if (i == 0) {
                emojiTitle = idArr[i] + "\n";
              } else {
                emojiStr += idArr[i] + "\n";
              }

              
              var minTempLength = minArr[i].length;
              // spaces = " " * (10 - minTempLength);
              for (let j = 0; j < (10-minTempLength); j++) {
                spaces += " ";
              }
              
              if (i == 0) {
                tempTitle = `\`${maxArr[i]}\`${spaces}\`${minArr[i]}\``;
              } else {
                tempStr += `\n**\`${maxArr[i]}\`**${spaces}\`${minArr[i]}\`\n`;
              }
            }
            console.log(emojiStr)
            sevenDayEmbed.addField(embedTitle, embedStr, true);
            sevenDayEmbed.addField(emojiTitle, emojiStr, true);
            sevenDayEmbed.addField(tempTitle, tempStr, true);

              try {
                await message.channel.send(sevenDayEmbed);
                console.log("SENT!");
              } catch(err) {
                console.log(err)
              }
            
            for (var i = 0; i < remEmoArr.length; i++) {
              try {
                await remEmoArr[i].delete();
                console.log('SUCCESSFULLY DELETED ALL EMOJIS!');
              } catch (error) {
                console.log(error)
              }
            }
          }
        )
      }
    )
  }
}