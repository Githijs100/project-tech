const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    savedBeers: [{
        type: String, // De SKU van het bier
        ref: 'Beer'   // Verwijst naar het Beer model (optioneel, afhankelijk van je implementatie)
    }]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;