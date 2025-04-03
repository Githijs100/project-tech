const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    savedBeers: [{ 
        sku: String,
        name: String,
        brewery: String,
        abv: String,
        image: String 
    }]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;