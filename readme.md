# NextGameToPlay

A simple node.js script that will tell you what Steam game to play next, based on how many players got the rarest achievement for each game.

It essentially tells you what might be the easiest game in your library to complete 100%.

Example:

    node nextgametoplay.js list_of_games.html

    ...
    Bitburner: 1%
    Wavetale: 10.9%
    Solar Ash: 3.7%
    SOVL: 0.4%
    Dummynation: 0%
    Linelith: 75%
    Monument Valley: 38.9%
    Monument Valley 2: 33.4%
    Stacklands: 10.5%
    DAGURI: Gambling Apocalypse: 2.6%
    Lorelei and the Laser Eyes: 1.7%
    Old World: 0%
    Cult of the Lamb: 1.3%
    Shogun Showdown: 0.7%

    Next game to play: Linelith 75%

## Usage

* Login to Steam using a web browser. 
* Go to Profile » Games. Make sure the URL points to: https://steamcommunity.com/profiles/{ID}/games/?tab=all , where {ID} is a numeric value representing your Steam ID.
* Save the webpage (in Chrome right-click on the page -> Save as...)
* Download the script: grab `nextgametoplay.js` from the [releases](https://github.com/mihaifm/nextgametoplay/releases/latest)
* Install [node.js](https://nodejs.org)
* Open a command line or powershell
* Type `node nextgametoplay.js Games.htm`, where Games.htm is the web page you saved earlier.

## Notes

You can save the output to a file. It will be sorted by the difficulty of the rarest achievement for each game. Just add another parameter to the command

    node nextgametoplay.js list_of_games.html output.txt
