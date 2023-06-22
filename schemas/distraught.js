const mongoose = require("mongoose")

var distraught = new mongoose.Schema({
    personID: String,
})

module.exports = mongoose.models.misc || mongoose.model("misc", distraught)