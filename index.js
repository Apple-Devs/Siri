const Discord = require("discord.js");
const client = new Discord.Client();
const { translate } = require("google-translate-api-browser");
const Canvas = require('canvas');
const fs = require("fs");
const langs = {"auto":"Automatic","af":"Afrikaans","sq":"Albanian","am":"Amharic","ar":"Arabic","hy":"Armenian","az":"Azerbaijani","eu":"Basque","be":"Belarusian","bn":"Bengali","bs":"Bosnian","bg":"Bulgarian","ca":"Catalan","ceb":"Cebuano","ny":"Chichewa","zh-cn":"Chinese Simplified","zh-tw":"Chinese Traditional","co":"Corsican","hr":"Croatian","cs":"Czech","da":"Danish","nl":"Dutch","en":"English","eo":"Esperanto","et":"Estonian","tl":"Filipino","fi":"Finnish","fr":"French","fy":"Frisian","gl":"Galician","ka":"Georgian","de":"German","el":"Greek","gu":"Gujarati","ht":"Haitian Creole","ha":"Hausa","haw":"Hawaiian","iw":"Hebrew","hi":"Hindi","hmn":"Hmong","hu":"Hungarian","is":"Icelandic","ig":"Igbo","id":"Indonesian","ga":"Irish","it":"Italian","ja":"Japanese","jw":"Javanese","kn":"Kannada","kk":"Kazakh","km":"Khmer","ko":"Korean","ku":"Kurdish (Kurmanji)","ky":"Kyrgyz","lo":"Lao","la":"Latin","lv":"Latvian","lt":"Lithuanian","lb":"Luxembourgish","mk":"Macedonian","mg":"Malagasy","ms":"Malay","ml":"Malayalam","mt":"Maltese","mi":"Maori","mr":"Marathi","mn":"Mongolian","my":"Myanmar (Burmese)","ne":"Nepali","no":"Norwegian","ps":"Pashto","fa":"Persian","pl":"Polish","pt":"Portuguese","pa":"Punjabi","ro":"Romanian","ru":"Russian","sm":"Samoan","gd":"Scots Gaelic","sr":"Serbian","st":"Sesotho","sn":"Shona","sd":"Sindhi","si":"Sinhala","sk":"Slovak","sl":"Slovenian","so":"Somali","es":"Spanish","su":"Sundanese","sw":"Swahili","sv":"Swedish","tg":"Tajik","ta":"Tamil","te":"Telugu","th":"Thai","tr":"Turkish","uk":"Ukrainian","ur":"Urdu","uz":"Uzbek","vi":"Vietnamese","cy":"Welsh","xh":"Xhosa","yi":"Yiddish","yo":"Yoruba","zu":"Zulu"}
const langsInverted = {};
for (const key in langs) {
  const value = langs[key];
  langsInverted[value] = key;
}

convertFileToArray = filePath => {
  let arrayName = fs.readFileSync(filePath).toString("utf8").split("\n");
  return arrayName;
}

let greetingsArr       = convertFileToArray ( "greetings.txt" ) ;
let commandsArr        = convertFileToArray ( "commands.txt" ) ;
let searchCommandsArr  = convertFileToArray ( "searchCommands.txt" ) ;
let jokesArr           = convertFileToArray ( "jokes.txt" ) ;
let swearWordsArr      = convertFileToArray ( "swearWords.txt" ) ;

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
  if (args.includes("bruh")) {
    message.channel.send("https://tenor.com/view/bruh-moment-bruh-moment-recording-gif-14698316");
  }

  if (args.includes("rekt")) {
    message.channel.send("https://tenor.com/view/getrekt-shotsfired-sass-stephen-hawking-hawking-gif-5271851");
  }

  if (args.includes("delete")) {
    message.channel.send("https://tenor.com/view/anastasia-thot-bot-delete-this-points-gun-smiling-gif-14345891");
  }

  const checkHeySiriJs = require ( "./commands/heySiri.js"            ) ;
  const profanityJs    = require ( "./commands/checkForSwearWords.js" ) ;
  const swearCheckJs   = require ( "./commands/swearCheck.js"         ) ;
  const positionSearch = require ( "./commands/messageSearchPos.js"   ) ;
  const pingJs         = require ( "./commands/ping.js"               ) ;
  const searchJs       = require ( "./commands/search.js"             ) ;
  const muteJs         = require ( "./commands/mute.js"               ) ;
  const banJs          = require ( "./commands/ban.js"                ) ;
  const kickJs         = require ( "./commands/kick.js"               ) ;
  const convertIntJs   = require ( "./commands/convertInt.js"         ) ;
  const inviteJs       = require ( "./commands/createInviteLink.js"   ) ;
  const rollaDieJs     = require ( "./commands/rollaDie.js"           ) ;
  const jokeJs         = require ( "./commands/joke.js"               ) ;
  const timeJs         = require ( "./commands/time.js"               ) ;

  const checkGreeting      = () => checkHeySiriJs.checkGreeting  ( greetingsArr , args                                                  ) ;  
  const checkForSwearWords = () => profanityJs.execute           ( swearWordsArr , args                                                 ) ;
  const swearCheck         = () => swearCheckJs.execute          ( message , checkForSwearWords                                         ) ;
  const checkOperation     = () => checkHeySiriJs.checkOperation ( commandsArr , args , operation, message                              ) ;
  const messageSearchPos   = () => positionSearch.execute        (                                                                      ) ;
  const ping               = () => pingJs.execute                ( message                                                              ) ;
  const searchTheSearch    = () => searchJs.searchTheSearch      ( searchCommandsArr , args , searchEngine                              ) ;
  const search             = () => searchJs.search               ( searchEngine , searchTheSearch , messageSearchPos , object , message ) ;
  const mute               = () => muteJs.mute                   ( message , args                                                       ) ;
  const unmute             = () => muteJs.unmute                 ( message , args                                                       ) ;
  const ban                = () => banJs.ban                     ( message                                                              ) ;
  const kick               = () => kickJs.kick                   ( message                                                              ) ;
  const convertInt         = () => convertIntJs.convertInt       ( message                                                              ) ;
  const createInviteLink   = () => inviteJs.createInviteLink     (                                                                      ) ;
  const rollaDie           = () => rollaDieJs.rollaDie           ( message                                                              ) ;
  const joke               = () => jokeJs.joke                   ( jokesArr , message                                                   ) ;
  const time               = () => timeJs.time                   ( args , message                                                       ) ;

  traduisez = () => {

    // newspi is an array of the message sent by the user with every index being either a word, a colon or a double-quote.
    // For example: If messageContent == John replied to Jane, "You have two choices: turn left or turn right."
    // output >> [ "John", "replied", "to", "Jane,", "\"", "You", "have", "two", "choices", ":", "turn", "left", "or", "turn", "right.", "\"" ]
    const newspi = messageContent.match (/[^:"\s]+|\:|"/g) ;


    // checkFor( word , inverted , array ) takes 3 parameters:
    // word:String - The word you're checking for.
    // inverted:Boolean - if true then it will check from the last index if false then it will check from the first index.
    // array:Object - The array from which you are sorting out the word.
    // It returns false if that word is not in the array else it returns the array index of the word.

    checkFor = ( word , inverted , array) => {
      inverted ? i = array.lastIndexOf( word ) : i = newspi.indexOf ( word ) ;
      return i == -1 ? false : i ;
    }

    checkForThePositionOf = ( word , inverted ) => {
      let wordPos = checkFor ( word , inverted , newspi )
      if ( newspi [ wordPos ] == word ) return wordPos 
      else return -1 ;
    }

    translateIt = () => {
      let 
      firstQuotePos           = checkForThePositionOf ( "\""    , false ) ;
      secondQuotePos          = checkForThePositionOf ("\""     , true  ) ;
      colonPos                = checkForThePositionOf ( ":"     , false ) ;
      fromPos                 = checkForThePositionOf ( "from"  , false ) ;
      toPos                   = checkForThePositionOf ( "to"    , false ) ;
      untranslatedArray       = []                                        ;
      fromLangArray           = []                                        ;
      toLangArray             = []                                        ;
      untranslatedText        = ""                                        ;
      fromLang                = ""                                        ;
      toLang                  = ""                                        ;
      ISOCode                 = ""                                        ;
      isUsingQuotes           = firstQuotePos != secondQuotePos           ;
      isUsingColons           = colonPos != -1                            ;
      containsFirstQuote      = firstQuotePos != -1                       ;
      containsSecondQuote     = secondQuotePos != -1                      ;
      containsQuotesOrColons  = isUsingQuotes || isUsingColons            ;
      containsFrom            = fromPos != -1                             ;
      fromBeforeQuotes        = fromPos < firstQuotePos                   ;
      fromAfterQuotes         = fromPos > secondQuotePos                  ;
      fromBeforeColons        = fromPos < colonPos                        ;
      fromAfterColons         = fromPos > secondQuotePos                  ;
      containsTo              = toPos != -1                               ;
      toBeforeQuotes          = toPos < firstQuotePos                     ;
      toAfterQuotes           = toPos > secondQuotePos                    ;
      toBeforeColons          = toPos < colonPos                          ;
      toAfterColons           = toPos > secondQuotePos                    ;

      

      fromTranslate = () => {
        if ( containsFrom ) {
          if ( containsQuotesOrColons ) {
            if ( containsFirstQuote && containsSecondQuote ) {
              if ( fromBeforeQuotes || fromAfterQuotes ) return true ;
            } else if ( isUsingColons ) {
              if ( fromBeforeColons || fromAfterColons ) return true ;
            } else return false ;
          }
          return true ;
        } else return false ;
      }

      toTranslate = () => {
        if ( containsTo ) {
          if ( containsQuotesOrColons ) {
            if ( containsFirstQuote && containsSecondQuote ) {
              if ( toBeforeQuotes || toAfterQuotes ) return true ;
            } else if ( isUsingColons ) {
              if ( toBeforeColons || toAfterColons ) return true ;
            } else return false ;
          }
          return true ;
        } else return false ;
      }

      if ( isUsingQuotes ) {
        untranslatedArray = newspi.slice ( firstQuotePos + 1 , secondQuotePos ) ;
        if ( fromTranslate() && toTranslate() ) {
          if (fromPos < toPos) {
            fromLangArray = newspi.slice ( fromPos + 1 , toPos ) ;
            if ( toPos < firstQuotePos ) {
              toLangArray   = newspi.slice ( toPos + 1 , firstQuotePos ) ;
            } else if ( secondQuotePos < toPos ) {
              toLangArray   = newspi.slice ( toPos + 1 , newspi.length ) ;
            }
          } else if (toPos < fromPos) {
            toLangArray = newspi.slice ( toPos + 1 , fromPos ) ;
            if ( fromPos < firstQuotePos ) {
              fromLangArray   = newspi.slice ( fromPos + 1 , firstQuotePos ) ;
            } else if ( secondQuotePos < fromPos ) {
              fromLangArray   = newspi.slice ( fromPos + 1 , newspi.length ) ;
            }
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
      } else if ( isUsingColons ) {
        if ( fromTranslate() && toTranslate() ) {
          if (fromPos < toPos) {
            untranslatedArray = newspi.slice ( colonPos + 1 , fromPos ) ;
            fromLangArray = newspi.slice ( fromPos + 1 , toPos ) ;
            if ( toPos < colonPos ) {
              toLangArray = newspi.slice ( toPos + 1 , colonPos ) ;
            } else if ( colonPos < toPos ) {
              toLangArray = newspi.slice ( toPos + 1 , newspi.length ) ;
            }
          } else if (toPos < fromPos) {
            untranslatedArray = newspi.slice ( colonPos + 1 , toPos ) ;
            toLangArray = newspi.slice ( toPos + 1 , fromPos ) ;
            if ( fromPos < colonPos ) {
              fromLangArray = newspi.slice ( fromPos + 1 , colonPos ) ;
            } else if ( colonPos < fromPos ) {
              fromLangArray = newspi.slice ( fromPos + 1 , newspi.length ) ;
            }
          }
        } else if ( fromTranslate() && !toTranslate() ) {
          untranslatedArray = newspi.slice ( colonPos + 1 , fromPos ) ;
          if ( fromPos < colonPos ) {
            fromLangArray = newspi.slice ( fromPos + 1 , colonPos ) ;
          } else if ( colonPos < fromPos ) {
            fromLangArray = newspi.slice ( fromPos + 1 , newspi.length ) ;
          }
        } else if ( !fromTranslate() && toTranslate() ) {
          untranslatedArray = newspi.slice ( colonPos + 1 , toPos ) ;
          if ( toPos < colonPos ) {
            toLangArray = newspi.slice ( toPos + 1 , colonPos ) ;
          } else if ( colonPos < toPos ) {
            toLangArray = newspi.slice ( toPos + 1 , newspi.length ) ;
          }
        } else if ( !fromTranslate() && !toTranslate() ) {
          untranslatedArray = newspi.slice ( colonPos + 1 , newspi.length ) ;
        }
      } else {
        if ( fromTranslate() && toTranslate() ) {
          if (fromPos < toPos) {
            untranslatedArray = newspi.slice ( 3 , fromPos ) ; 
            fromLangArray = newspi.slice ( fromPos + 1 , toPos ) ;
            toLangArray = newspi.slice ( toPos + 1 , newspi.length ) ;
          } else if (toPos < fromPos) {
            untranslatedArray = newspi.slice ( 3 , toPos ) ;
            toLangArray = newspi.slice ( toPos + 1 , fromPos ) ;
            fromLangArray = newspi.slice ( fromPos + 1 , newspi.length ) ;
  
          }
        } else if ( fromTranslate() && !toTranslate() ) {
          untranslatedArray = newspi.slice ( 3 , fromPos ) ;
          fromLangArray = newspi.slice ( fromPos + 1 , newspi.length ) ;
        } else if ( !fromTranslate() && toTranslate() ) {
          untranslatedArray = newspi.slice ( 3 , toPos ) ;
          toLangArray = newspi.slice ( toPos + 1 , newspi.length ) ;
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
    translateIt();
  }

  toile = () => {
    var canvasWidth = 1000;
    var canvasHeight = 1000;
    
    const canvas = Canvas.createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = "#030f33"
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    drawStar = (x, y, w) => {
      var rad = ctx.createRadialGradient(x, y, w/1.5, x, y, w*2);
        rad.addColorStop(0, "white");
        rad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath();
      ctx.arc(x, y, w*2, 0, 2 * Math.PI);
      ctx.fillStyle = rad;
      ctx.fill();
      ctx.closePath();
    }

    for (var i = 0; i < Math.floor(Math.random() * 250) + 100; i++) {
      var starX = Math.floor(Math.random() * canvasWidth) + 1
      var starY = Math.floor(Math.random() * canvasHeight) + 1
      var starW = Math.floor(Math.random() * 5) + 1;

      drawStar(starX, starY, starW)

    }
    

    const attachment = new Discord.MessageAttachment(canvas.toBuffer());
    message.channel.send(attachment);   

  }

  operation = checkOperation();
  checkForSwearWords()

  const siriGreeting = `Hi ${message.author.username}, I am Siri, your personal virtual assistant. How may I help you?`;

  if (checkGreeting() && !checkOperation()) {
    message.channel.send(siriGreeting);
  }

  if (checkOperation() && checkGreeting()) {

    switch (operation) {
      default:
        message.channel.send("I'm not sure I understand.");
      case "ping" :
        ping();
        break;

      case "search":
        search();
        break;

      case "mute":
        mute();
        break;

      case "unmute":
        unmute();
        break;
      
      case "ban":
        ban();
        break;

      case "clear":
        b = convertInt();
        clear(b);
        break;

      case "kick":
        kick();
        break;
      
      case "invite":
        createInviteLink();
        break;

      case "rolladie":
        rollaDie();
        break;

      case "joke":
        joke();
        break;

      case "pun":
        joke();
        break;

      case "time":
        time();
        break;

      case "translate":
        traduisez();
        break;
      
      case "toile":
        toile();
        break;
    }
  }

});

const config = require("./config.json");
const swearCheck = require("./commands/swearCheck.js");
client.login(config.token);
