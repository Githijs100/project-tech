// models/postModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    // User who made the post
    username: {
        type: String,
        required: true
    },
    // Optional: User's profile image to display with the post
    userProfileImage: {
        type: String,
        default: '/images/user2-logo.png' // Default placeholder if not set
    },
    // When the post was made (for simplicity, a string like "3 minuten geleden")
    timeAgo: {
        type: String,
        default: "Net geplaatst"
    },
    // Beer details for the post
    beerName: {
        type: String,
        required: true
    },
    // Rating of the beer (e.g., 4.5 for 4.5 stars)
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    // Path to the beer's image that's part of the post
    postImage: {
        type: String,
        required: true
    },
    // The main text/review of the post
    postText: {
        type: String,
        required: true
    },
    // Engagement counts
    likesCount: {
        type: Number,
        default: 0
    },
    commentsCount: {
        type: Number,
        default: 0
    },
    // Optional: SKU of the beer if "Meer over dit biertje" links to a detail page
    beerSku: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Post', postSchema, 'posts'); // Collection name will be 'posts'
