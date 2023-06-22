const levels = require("./schemas/levels")
const leaderboard = require("./schemas/leaderboard")
const misc = require("./schemas/distraught")

module.exports = {
    levelsSchema: levels,
    leaderboardSchema: leaderboard,
    distraught: misc
}