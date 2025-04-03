const mongoose = require('mongoose');

const BeerSchema = new mongoose.Schema({
    sku: { type: String, required: true, unique: true }, // Unieke identifier voor het bier
    name: { type: String, required: true },             // Naam van het bier
});

const Beer = mongoose.model('Beer', BeerSchema);

module.exports = Beer;


