module.exports = {
  name: "search",
  searchTheSearch(searchCommandsArr, args, searchEngine) {
    for (let i = 0; i < searchCommandsArr.length; i++) {
      for (let j = 0; j < args.length; j++) {
        
        let searchStr = "";
        searchStr += args[j];
        searchStr += " ";
        searchStr += args[j+1];
        // console.log(j)
        // console.log(searchStr);

        if (searchCommandsArr[i] == searchStr) {
          searchEngine = args[j] + "\ " + args[j+1];
          console.log(
            `Searched for the search engine. The search engine is ${searchEngine}`
          );
        } else if (searchCommandsArr[i] == args[j]){
          searchEngine = args[j];
          console.log(
            `Searched for the search engine. The search engine is ${searchEngine}`
          );
        }
        return searchEngine;
      }
    }
  },
  search(searchEngine, searchTheSearch, checkPositionOfSearchMessage, object, message) {
    searchEngine = searchTheSearch();
    checkPositionOfSearchMessage();
    let linkargs = object.split(" ").join("&20");
    searchThis = (siteLink) => {
      message.channel.send("https://" + siteLink + linkargs)
    }
    switch (searchEngine) {
      case "google":
        searchThis("google.com/search?q=")
        break;
      case "spotify":
        searchThis("open.spotify.com/search/")
        break;
      case "youtube":
        searchThis("youtube.com/results?search_query")
        break;
      case "apple music":
        searchThis("music.apple.com/us/search?term=")
        break;
      case 'duckduckgo':
        searchThis("duckduckgo.com/?q=")
        break;
      case 'youtube music':
        searchThis("music.youtube.com/search?q=")
        break;
      case 'bing':
        searchThis("bing.com/search?q=")
        break;
    }
  }
}