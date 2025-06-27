// scripts/setupPosts.js

const User = require('../models/user'); // Import the User model
const Beer = require('../models/beerModel'); // Import the Beer model
const Post = require('../models/postModel'); // Import the Post model

async function setupPosts() {
    try {
        await Post.deleteMany({});
        console.log('✅ Existing posts cleared.');
        const demoUser = await User.findOne({ username: 'DemoUser' });
        const demoUser2 = await User.findOne({ username: 'DemoUser2' });
        const demoUser3 = await User.findOne({ username: 'DemoUser3' }); 
        const allAvailableBeerSKUs = ["118161", "100187", "134872", "134620","100206", "112897", "102102", "121601"];

        const allBeers = await Beer.find({ sku: { $in: allAvailableBeerSKUs } });

        // Helper function to get a random beer from the fetched list
        function getRandomBeer() {
            const randomIndex = Math.floor(Math.random() * allBeers.length);
            return allBeers[randomIndex];
        }

        const postsData = [];

        // --- Post 1 ---
        const randomBeer1 = getRandomBeer();
        if (demoUser && randomBeer1) {
            postsData.push({
                username: demoUser.username,
                userProfileImage: demoUser.profileImage,
                timeAgo: "3 minuten geleden",
                beerName: randomBeer1.name,
                rating: 4.5,
                postImage: randomBeer1.image,
                postText: "Wat een lekker biertje zeg! Zodra je de eerste slok naar binnen hebt voel je gelijk dat het weekend is.",
                likesCount: 15,
                commentsCount: 3,
                beerSku: randomBeer1.sku
            });
        }

        // --- Post 2  ---
        const randomBeer2 = getRandomBeer();
        if (demoUser2 && randomBeer2) {
            postsData.push({
                username: demoUser2.username,
                userProfileImage: demoUser2.profileImage,
                timeAgo: "1 uur geleden",
                beerName: randomBeer2.name,
                rating: 3,
                postImage: randomBeer2.image,
                postText: "Niet slecht voor een doordeweekse avond. Prima dorstlesser!",
                likesCount: 8,
                commentsCount: 1,
                beerSku: randomBeer2.sku
            });
        }

        // --- Post 3 ---
        const randomBeer3 = getRandomBeer();
        if (demoUser3 && randomBeer3) { // Using DemoUser3 here
            postsData.push({
                username: demoUser3.username, // Using DemoUser3's username
                userProfileImage: demoUser3.profileImage, // Using DemoUser3's profile image
                timeAgo: "1 dag geleden",
                beerName: randomBeer3.name,
                rating: 5,
                postImage: randomBeer3.image,
                postText: "Absolute favoriet! Een aanrader voor iedereen die van speciaalbier houdt.",
                likesCount: 25,
                commentsCount: 5,
                beerSku: randomBeer3.sku
            });
        }

        // --- Post 4 ---
        const randomBeer4 = getRandomBeer();
        if (demoUser && randomBeer4) {
            postsData.push({
                username: demoUser.username,
                userProfileImage: demoUser.profileImage,
                timeAgo: "2 dagen geleden",
                beerName: randomBeer4.name,
                rating: 4,
                postImage: randomBeer4.image,
                postText: "Heerlijk bier, perfect voor een zomerse avond. Zeker een aanrader!",
                likesCount: 10,
                commentsCount: 2,
                beerSku: randomBeer4.sku
            });
        }

        // --- Post 5  ---
        const randomBeer5 = getRandomBeer();
        if (demoUser2 && randomBeer5) {
            postsData.push({
                username: demoUser2.username,
                userProfileImage: demoUser2.profileImage,
                timeAgo: "3 dagen geleden",
                beerName: randomBeer5.name,
                rating: 3.5,
                postImage: randomBeer5.image,
                postText: "Een klassieker die nooit verveelt. Goede balans en drinkt lekker weg.",
                likesCount: 18,
                commentsCount: 4,
                beerSku: randomBeer5.sku
            });
        }

        await Post.insertMany(postsData);
        console.log(`✅ ${postsData.length} posts created/updated.`);
        return `Successfully setup ${postsData.length} predefined posts!`;

    } catch (err) {
        console.error('Error setting up posts:', err);
        throw new Error('Error setting up posts: ' + err.message);
    }
}

module.exports = setupPosts;
