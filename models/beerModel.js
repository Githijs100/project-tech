const mongoose = require("mongoose");

const beerSchema = new mongoose.Schema({
    name: String,
    country: String,
    abv: Number,
    food_pairing: String,
    sub_category_2: String,
    image: String
});

module.exports = mongoose.model("Beer", beerSchema);

