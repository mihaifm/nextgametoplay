const fs = require('fs');
const https = require('https');
const path = require('path');

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchAchievements(id) {
    return new Promise((resolve, reject) => {
        const url = `https://steamcommunity.com/stats/${id}/achievements`;

        function makeRequest(url, redirectCount = 0) {
            if (redirectCount > 5) {
                return reject(new Error(`Too many redirects for ID ${id}`));
            }

            const req = https.get(url, (response) => {
                // If the response is a redirect (status code 3xx), follow it
                if (response.statusCode >= 300 && response.statusCode < 400) {
                    const redirectUrl = response.headers.location;

                    // Discard response to close the socket
                    response.resume();

                    makeRequest(redirectUrl, redirectCount + 1);
                    return;
                }

                let data = '';

                response.on('data', (chunk) => {
                    data += chunk;
                });

                response.on('end', () => {
                    let gameName = id;
                    const titleMatch = data.match(/<title>(.*?)<\/title>/i);

                    if (titleMatch && titleMatch[1]) {
                        const tokens = titleMatch[1].split('::');
                        if (tokens.length > 1) {
                            gameName = tokens[1].trim();
                        }
                    }

                    const percentages = [];
                    const percentageRegex = /<div class="achievePercent">([\d.]+)%<\/div>/g;

                    while ((match = percentageRegex.exec(data)) !== null) {
                        percentages.push(parseFloat(match[1]));
                    }

                    resolve({ gameName, percentages });
                });

                response.on('error', (err) => {
                    reject(new Error(`Error fetching data for ID ${id}: ${err.message}`));
                });

            });

            req.on('error', (err) => {
                reject(new Error(`Request error for ID ${id}: ${err.message}`));
            });

            req.setTimeout(10000, () => {
                req.destroy();
                reject(new Error(`Timeout fetching data for ID ${id}`));
            });
        }

        makeRequest(url);
    });
}

async function main() {
    try {
        const htmlFileName = process.argv[2];

        if (!htmlFileName) {
            console.log('Usage: node nextgametoplay.js list_of_games.html');
            process.exit(1);
        }

        const htmlPath = path.resolve(htmlFileName);

        if (!fs.existsSync(htmlPath)) {
            console.log(`Error: File not found ${htmlFileName}`);
            process.exit(1);
        }

        const data = fs.readFileSync(htmlPath, 'utf8');

        const regex = /appid&quot;:(\d+),&quot;unlocked&quot;:(\d+),&quot;total&quot;:(\d+),&quot;percentage&quot;:&quot;(\d+)/g;

        const ids = []
        let match;

        while ((match = regex.exec(data)) !== null) {
            ids.push({ id: match[1], completed: +match[4] });
        }

        const gameData = []

        for (let idobj of ids) {
            const { gameName, percentages } = await fetchAchievements(idobj.id);

            if (percentages.length > 0) {
                const lowestPercentage = Math.min(...percentages);
                console.log(`${gameName}: ${lowestPercentage}%`);
                gameData.push({
                    id: idobj.id,
                    completed: idobj.completed,
                    gameName,
                    lowestPercentage
                });
            }

            await delay(500);
        }

        if (gameData.length == 0)
            return;

        gameData.sort((a, b) => b.lowestPercentage - a.lowestPercentage);

        const lines = gameData.map(obj => `${obj.id} ${obj.gameName} ${obj.lowestPercentage}`);
        const output = lines.join('\n');

        if (process.argv[3]) {
            fs.writeFileSync(process.argv[3], output, 'utf8');
        }

        for (gameEntry of gameData) {
            if (gameEntry.completed != 100) {
                console.log(`\nNext game to play: ${gameEntry.gameName} ${gameEntry.lowestPercentage}%`);
                break;
            }
        }

        await delay(500);
    } catch (error) {
        console.error(error);
    }
}

main();
