const mongoose = require("mongoose");

const beerSchema = new mongoose.Schema({
  sku: String,
  name: String,
  brewery: String,
  rating: String,
  category: String,
  sub_category_1: String,
  sub_category_2: String,
  sub_category_3: String,
  description: String,
  region: String,
  country: String,
  abv: String,
  ibu: String,
  calories_per_serving_12oz: String,
  carbs_per_serving_12oz: String,
  tasting_notes: String,
  food_pairing: String,
  suggested_glassware: String,
  serving_temp_f: String,
  serving_temp_c: String,
  beer_type: String,
  features: String,
});

const Beer = mongoose.model("Beer", beerSchema);

module.exports = Beer;


