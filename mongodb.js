const mongoose = require("mongoose")
const levels = require("./schemas/levels")
const leaderboard = require("./schemas/leaderboard")
const misc = require("./schemas/distraught")
mongoose.connect(process.env.MONGODB_URI);

export const levelsSchema = levels
export const leaderboardSchema = leaderboard
export const distraught = misc