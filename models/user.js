const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    beersPerDay: { type: Number, default: 0 },
    beersDrank: { type: Number, default: 0 },
    savedBeers: [{
        type: String, 
        ref: 'Beer'
    }],
    profileImage: {
        type: String,
        default: '/images/user2-logo.png' // Default image if none is set
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;