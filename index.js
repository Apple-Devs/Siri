const Discord = require("discord.js");
const client = new Discord.Client();
const { translate } = require("google-translate-api-browser");
const fs = require("fs");
const langs = {"auto":"Automatic","af":"Afrikaans","sq":"Albanian","am":"Amharic","ar":"Arabic","hy":"Armenian","az":"Azerbaijani","eu":"Basque","be":"Belarusian","bn":"Bengali","bs":"Bosnian","bg":"Bulgarian","ca":"Catalan","ceb":"Cebuano","ny":"Chichewa","zh-cn":"Chinese Simplified","zh-tw":"Chinese Traditional","co":"Corsican","hr":"Croatian","cs":"Czech","da":"Danish","nl":"Dutch","en":"English","eo":"Esperanto","et":"Estonian","tl":"Filipino","fi":"Finnish","fr":"French","fy":"Frisian","gl":"Galician","ka":"Georgian","de":"German","el":"Greek","gu":"Gujarati","ht":"Haitian Creole","ha":"Hausa","haw":"Hawaiian","iw":"Hebrew","hi":"Hindi","hmn":"Hmong","hu":"Hungarian","is":"Icelandic","ig":"Igbo","id":"Indonesian","ga":"Irish","it":"Italian","ja":"Japanese","jw":"Javanese","kn":"Kannada","kk":"Kazakh","km":"Khmer","ko":"Korean","ku":"Kurdish (Kurmanji)","ky":"Kyrgyz","lo":"Lao","la":"Latin","lv":"Latvian","lt":"Lithuanian","lb":"Luxembourgish","mk":"Macedonian","mg":"Malagasy","ms":"Malay","ml":"Malayalam","mt":"Maltese","mi":"Maori","mr":"Marathi","mn":"Mongolian","my":"Myanmar (Burmese)","ne":"Nepali","no":"Norwegian","ps":"Pashto","fa":"Persian","pl":"Polish","pt":"Portuguese","pa":"Punjabi","ro":"Romanian","ru":"Russian","sm":"Samoan","gd":"Scots Gaelic","sr":"Serbian","st":"Sesotho","sn":"Shona","sd":"Sindhi","si":"Sinhala","sk":"Slovak","sl":"Slovenian","so":"Somali","es":"Spanish","su":"Sundanese","sw":"Swahili","sv":"Swedish","tg":"Tajik","ta":"Tamil","te":"Telugu","th":"Thai","tr":"Turkish","uk":"Ukrainian","ur":"Urdu","uz":"Uzbek","vi":"Vietnamese","cy":"Welsh","xh":"Xhosa","yi":"Yiddish","yo":"Yoruba","zu":"Zulu"}
const langsInverted = {};
for (const key in langs) {
  const value = langs[key];
  langsInverted[value] = key;
}

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

client.on("ready", () => console.log("Hello There!"));

client.on("message", (message) => {
  var messageContent = message.content;
  if (message.author.bot || message.channel.type === "dm") return;

  let punctuationLess = message.content.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
  let finalString = punctuationLess.replace(/\s{2,}/g," ");
  message.content = finalString;

  let args = message.content.split(/ +/);
  let revArgs = message.content.split(/ +/).reverse();
  let operation, object, searchEngine;
  let b;
  // console.log(greetingsArr);
  // console.log(args);

  /*
    checkGreeting() is in ./commands/checkGreeting.js
    checkForSwearWords() is in ./commands/checkForSwearWords.js

  */

  const checkHeySiriFile = require("./commands/heySiri.js");
  const checkGreeting = () => checkHeySiriFile.checkGreeting(greetingsArr, args);

  
  const checkForSwearWordsFile = require("./commands/checkForSwearWords.js");
  const checkForSwearWords = () => checkForSwearWordsFile.execute(swearWordsArr, args);

  const swearCheckFile = require("./commands/swearCheck.js");
  const swearCheck = () => swearCheckFile.execute(message, checkForSwearWords);

  const checkOperation = () => checkHeySiriFile.checkOperation(commandsArr, args, operation);
  operation = checkOperation();

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

  const pingFile = require("./commands/ping.js");
  const ping = () => pingFile.execute(message);

  const searchFile = require("./commands/search.js");
  const searchTheSearch = () => searchFile.searchTheSearch(searchCommandsArr, args, searchEngine);
  const search = () => searchFile.search(searchEngine, searchTheSearch, checkPositionOfSearchMessage, object, message);

  const muteFile = require('./commands/mute.js');
  const mute = () => muteFile.mute(message, args);
  const unmute = () => muteFile.unmute(message, args)

  const banFile = require("./commands/ban.js");
  const ban = () => banFile.ban(message);

  // const clearFile = require("./commands/clear.js");
  // const clear = (numberOfMessagesToBeCleared) => clearFile.clear(message, numberOfMessagesToBeCleared);

  const kickFile = require("./commands/kick.js");
  const kick = () => kickFile.kick(message);

  const convertIntFile = require("./commands/convertInt.js");
  const convertInt = () => convertIntFile.convertInt(message);

  const createInviteFile = require("./commands/createInviteLink.js");
  const createInviteLink = () => createInviteFile.createInviteLink();

  const rollaDieFile = require("./commands/rollaDie.js");
  const rollaDie = () => rollaDieFile.rollaDie(message);

  const jokeFile = require("./commands/joke.js");
  const joke = () => jokeFile.joke(jokesArr, message);

  const timeFile = require("./commands/time.js");
  const time = () => timeFile.time(args, message);

  swearCheck();

  var everyLetter = messageContent.trim().split("");
  var messageWords = messageContent.toLowerCase().trim().split(' ');
  const newspi = messageContent.match(/[^:"\s]+|\:|"/g);

  checkFor = (word, inverted) => {
    inverted ? i = newspi.lastIndexOf(word) : i = newspi.indexOf(word);
    return i == -1 ? false : i;
  }

  checkForThePositionOf = (word, inverted) => {
    let wordPos = checkFor(word, inverted)
    if (newspi[wordPos] == word){
      return wordPos;
    } else {
      return -1;
    }
  }

  translateIt = () => {
    let firstQuotePos       = checkForThePositionOf ( "\""    , false ) ;
    let secondQuotePos      = checkForThePositionOf ("\""     , true  ) ;
    let colonPos            = checkForThePositionOf ( ":"     , false ) ;
    let fromPos             = checkForThePositionOf ( "from"  , false ) ;
    let toPos               = checkForThePositionOf ( "to"    , false ) ;
    let untranslatedArray   = []                                        ;
    let fromLangArray       = []                                        ;
    let toLangArray         = []                                        ;
    let untranslatedText    = ""                                        ;
    let fromLang            = ""                                        ;
    let toLang              = ""                                        ;
    let ISOCode             = ""                                        ;

    isUsingQuotes = () => {
      if ( firstQuotePos != secondQuotePos ) {
        return true ;
      } else {
        return false ;
      }
    }

    isUsingColons = () => {
      if ( colonPos != -1 ) {
        return true ;
      } else {
        return false ;
      }
    }

    fromTranslate = () => {
      if ( fromPos != -1 ) {
        if ( isUsingQuotes() || isUsingColons() ) {
          if ( firstQuotePos != -1 && secondQuotePos != -1 ) {
            if ( fromPos < firstQuotePos || fromPos > secondQuotePos ) {
              return true ;
            }
          } else if ( colonPos != -1 ) {
            if ( fromPos < colonPos || fromPos > colonPos ) {
              return true ;
            }
          } else {
            return false ;
          }
        }
        return true;
      }
    }

    toTranslate = () => {
      if ( toPos != -1 ) {
        if ( firstQuotePos != -1 && secondQuotePos != -1 ) {
          if ( toPos < firstQuotePos || toPos > secondQuotePos ) {
            return true ;
          }
        } else if ( colonPos != -1 ) {
          if ( toPos < colonPos || toPos > colonPos ) {
            return true ;
          }
        } else {
          return false ;
        }
      }
    }

    if ( isUsingQuotes() ) {
      untranslatedArray = newspi.slice ( firstQuotePos + 1 , secondQuotePos ) ;
      if ( fromTranslate() && toTranslate() ) {
        if (fromPos < toPos) {
          fromLangArray = newspi.slice ( fromPos + 1 , toPos ) ;
          toLangArray   = newspi.slice ( toPos + 1 , newspi.length ) ;
        } else if (toPos < fromPos) {
          toLangArray = newspi.slice ( toPos + 1 , fromPos ) ;
          fromLangArray = newspi.slice ( fromPos + 1 , newspi.length ) ;
        }
      } else if ( fromTranslate() && !toTranslate() ) {
        if ( fromPos < firstQuotePos ) {
          fromLangArray = newspi.slice ( fromPos + 1 , firstQuotePos ) ;
        } else if ( secondQuotePos < fromPos ) {
          fromLangArray = newspi.slice ( fromPos + 1 , newspi.length ) ;
        }
      } else if ( !fromTranslate() && toTranslate() ) {
        if ( toPos < firstQuotePos ) {
          toLangArray = newspi.slice ( toPos + 1 , firstQuotePos ) ;
        } else if ( secondQuotePos < toPos ) {
          toLangArray = newspi.slice ( toPos + 1 , newspi.length ) ;
        }
      }
    } else if ( isUsingColons() ) {
      if ( fromTranslate() && toTranslate() ) {
        if (fromPos < toPos) {
          untranslatedArray = newspi.slice ( colonPos + 1 , fromPos ) ; 
        } else if (toPos < fromPos) {
          untranslatedArray = newspi.slice ( colonPos + 1 , toPos ) ;
        }
      } else if ( fromTranslate() && !toTranslate() ) {
        untranslatedArray = newspi.slice ( colonPos + 1 , fromPos ) ;
      } else if ( !fromTranslate() && toTranslate() ) {
        untranslatedArray = newspi.slice ( colonPos + 1 , toPos ) ;
      } else if ( !fromTranslate() && !toTranslate() ) {
        untranslatedArray = newspi.slice ( colonPos + 1 , newspi.length ) ;
      }
    } else {
      if ( fromTranslate() && toTranslate() ) {
        if (fromPos < toPos) {
          untranslatedArray = newspi.slice ( 3 , fromPos ) ; 
        } else if (toPos < fromPos) {
          untranslatedArray = newspi.slice ( 3 , toPos ) ;
        }
      } else if ( fromTranslate() && !toTranslate() ) {
        untranslatedArray = newspi.slice ( 3 , fromPos ) ;
      } else if ( !fromTranslate() && toTranslate() ) {
        untranslatedArray = newspi.slice ( 3 , toPos ) ;
      } else if ( !fromTranslate() && !toTranslate() ) {
        untranslatedArray = newspi.slice ( 3 , newspi.length ) ;
      }
    }

    for ( let i = 0; i < untranslatedArray.length ; i++ ) {
      untranslatedText += untranslatedArray[ i ] ;
      untranslatedText += " " ;
    }

    untranslatedText = untranslatedText.trim() ;

    checkForISOCodes = ( ISOarray ) => {
      if ( ISOarray.length == 1 && ISOarray[0].length == 2 ) {
        ISOCode = ISOarray [ 0 ] ;
        return ISOCode ;
      } else {
        return false;
      }
    }

    let fromISO = checkForISOCodes( fromLangArray ) ;
    let toISO   = checkForISOCodes ( toLangArray ) ;
    capitalizeFirstLetter = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    if ( fromISO != false) {
      fromISO = fromLang ;
    } else if (fromLangArray.length != 0) {
      for ( let i = 0 ; i < fromLangArray.length ; i++ ) {
        fromLang += fromLangArray[ i ] ;
        fromLang += " " ;
      }
      fromLang = fromLang.trim();
      fromLang = langsInverted[capitalizeFirstLetter(fromLang)]
    } else {
      fromLang = "auto";
    }

    if ( toISO != false ) {
      toIso = toLang ;
    } else if (toLangArray.length != 0 ) {
      for ( let i = 0 ; i < toLangArray.length ; i++ ) {
        toLang += toLangArray[ i ] ;
        toLang += " " ;
      }
      toLang = toLang.trim() ;
      toLang = langsInverted[capitalizeFirstLetter(toLang)] ;
    } else {
      toLang = "en" ;
    }
    console.log(fromLang);
    console.log(fromLangArray)
    console.log(langs[fromLang])

    translate(untranslatedText, {from: fromLang, to: toLang}).then(res => {
      if (fromLang = "auto") {
        fromLang = res.from.language.iso;
      }
      const translateEmbed = new Discord.MessageEmbed()
        .setColor('#4285F4')
        .setTitle('Translating from ' + langs[fromLang] + " to " + langs[toLang])
        .setAuthor('Siri', client.user.displayAvatarURL(), 'https://www.apple.com/au/siri/')
        .setThumbnail("https://support.apple.com/library/content/dam/edam/applecare/images/en_US/iOS/ios14-translate-app-icon.png")
        .addFields(
          
          // { name: '\u200B', value: '\u200B' },
          { name: untranslatedText, value: langs[fromLang], inline: true },
          { name: res.text, value: langs[toLang], inline: true },
        )
        if (res.from.text.didYouMean || res.from.text.autoCorrected) {
          translateEmbed.addFields(
            { name: 'Did you mean: ', value: res.from.text.value + ' **?**', inline: false },
          )
        }
        if (res.from.language.didYouMean) {
          translateEmbed.addFields(
            { name: 'Translated from: ', value: langs[fromLang], inline: false },
          )
        }
        translateEmbed
        .setTimestamp()
        .setFooter('Translated with Google Translate', 'https://i.pinimg.com/originals/44/10/19/4410197cf5de4fefe413b55860bb617d.png');

      message.channel.send(translateEmbed);
    }).catch(err => {
      message.channel.send(
      console.error(err)
      )
    });

  }


  // ---------------------------------------------------------------------------------------------------------|

    

    // ---------------------------------------------------------------------------------------------------------|

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
      b = convertInt();
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
    } else if (operation == 'translate') {
      translateIt();
    }
  }

});

const config = require("./config.json");
const swearCheck = require("./commands/swearCheck.js");
client.login(config.token);
