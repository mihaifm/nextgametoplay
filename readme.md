# Nextgametoplay

A simple node.js script that will tell you what Steam game to play next, based on how many players got the rarest achievement for each game.

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
* Go to Profile » Games. Make sure the URL points to: https://steamcommunity.com/profiles/ID/games/?tab=all
* Save the webpage (in Chrome right-click on the page -> Save as...)
* Download the script
* Install [node.js](https://nodejs.org)
* Open a command line or powershell
* Type `node nextgametoplay.js Games.htm`, where Games.htm is the web page you saved earlier.

## Notes

You can save a file containing a list of your games, sorted by the difficulty of the rarest achievement. Just add another parameter to the command

    node nextgametoplay.js list_of_games.html output.txt
