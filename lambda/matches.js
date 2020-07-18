const cheerio = require('cheerio');
const got = require('got');

const url = 'https://www.ecbahia.com/'


let nextMatch = async () => {
    const response = await got(url);
    const $ = cheerio.load(response.body);

    let nextMatch = {}

    // next match
    nextMatch.teamA = $('.area_proximo_jogo .proximo .escudo_a img').prop('alt')
    nextMatch.teamB = $('.area_proximo_jogo .proximo .escudo_b img').prop('alt')
    nextMatch.league = $('.area_proximo_jogo .proximo .infos a span').text()
    nextMatch.matchDay = $('.area_proximo_jogo .proximo .infos p').text()

    return nextMatch
};

let lastMatch = async () => {
    const response = await got(url);
    const $ = cheerio.load(response.body);

    let lastMatch = {}

    // last match
    lastMatch.teamA = $('.area_proximo_jogo .ultimos .escudo_a img').prop('alt')
    lastMatch.teamB = $('.area_proximo_jogo .ultimos .escudo_b img').prop('alt')
    $('.area_proximo_jogo .ultimos .escudo_a span').each(function (index, value) {
        if (index === 0) {
            lastMatch.teamAGoals = $(this).text()
        }
    });
    $('.area_proximo_jogo .ultimos .escudo_b span').each(function (index, value) {
        if (index === 0) {
            lastMatch.teamBGoals = $(this).text()
        }
    });
    $('.area_proximo_jogo .ultimos .infos a span').each(function (index, value) {
        if (index === 0) {
            lastMatch.league = $(this).text()
        }
    });
    $('.area_proximo_jogo .ultimos .infos p').each(function (index, value) {
        if (index === 0) {
            lastMatch.matchDay = $(this).text()
        }
    });
    return lastMatch
};

module.exports = {
    nextMatch,
    lastMatch
}
