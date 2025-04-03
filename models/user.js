const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    savedBeers: [{
        type: mongoose.Schema.Types.ObjectId, // Verwijst naar een ander document
        ref: 'Beer'                           // Verwijst naar het Beer-model
    }]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
