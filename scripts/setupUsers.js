// scripts/setupUsers.js

const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const User = require('../models/user'); // Import the User model (path relative to this script)

const saltRounds = 10; // Define saltRounds here, as it's used for hashing

async function setupUsers() {
    try {
        // --- DemoUser 1 Setup ---
        const demoUserProfileImagePath1 = '/images/demo-profile-pic.jpg'; // For DemoUser
        const demoUser1SavedBeers = ["100087", "118161", "102102", "134620", "121601", "100187", "112897"];
        let user1 = await User.findOne({ username: 'DemoUser' });
        if (!user1) {
            user1 = new User({
                username: 'DemoUser',
                email: 'demo@example.com',
                password: await bcrypt.hash('demopassword', saltRounds),
                followers: 123,
                following: 45,
                beersPerDay: 10,
                beersDrank: 320,
                savedBeers: demoUser1SavedBeers,
                profileImage: demoUserProfileImagePath1
            });
            await user1.save();
            console.log('✅ DemoUser created.');
        } else {
            user1.followers = 123;
            user1.following = 45;
            user1.beersPerDay = 10;
            user1.beersDrank = 320;
            user1.savedBeers = demoUser1SavedBeers;
            user1.profileImage = demoUserProfileImagePath1; // Unconditionally set for existing
            await user1.save();
            console.log('✅ DemoUser updated.');
        }

        // --- DemoUser 2 Setup ---
        const demoUserProfileImagePath2 = '/images/demo2-profile-pic.jpg';
        const demoUser2SavedBeers = ["112897", "134620", "100187", "121601", "100087", "118161", "102102"];
        let user2 = await User.findOne({ username: 'DemoUser2' }); // Check for DemoUser2
        if (!user2) {
            user2 = new User({
                username: 'DemoUser2',
                email: 'demo2@example.com', // Unique email
                password: await bcrypt.hash('demopassword2', saltRounds), // Unique password
                followers: 50, // Different values for variety
                following: 75,
                beersPerDay: 12,
                beersDrank: 400,
                savedBeers: demoUser2SavedBeers,
                profileImage: demoUserProfileImagePath2
            });
            await user2.save();
            console.log('✅ DemoUser2 created.');
        } else {
            user2.followers = 50;
            user2.following = 75;
            user2.beersPerDay = 12;
            user2.beersDrank = 400;
            user2.savedBeers = demoUser2SavedBeers;
            user2.profileImage = demoUserProfileImagePath2; // Unconditionally set for existing
            await user2.save();
            console.log('✅ DemoUser2 updated.');
        }

        // --- DemoUser 3 Setup ---
        const demoUserProfileImagePath3 = '/images/demo3-profile-pic.jpg';
        const demoUser3SavedBeers = ["102102", "121601", "118161", "100187", "134620", "112897", "100087"];
        let user3 = await User.findOne({ username: 'DemoUser3' });
        if (!user3) {
            user1 = new User({
                username: 'DemoUser3',
                email: 'demo3@example.com',
                password: await bcrypt.hash('demopassword3', saltRounds),
                followers: 23,
                following: 3,
                beersPerDay: 2,
                beersDrank: 18,
                savedBeers: demoUser3SavedBeers,
                profileImage: demoUserProfileImagePath3
            });
            await user1.save();
            console.log('✅ DemoUser3 created.');
        } else {
            user3.followers = 23;
            user3.following = 3;
            user3.beersPerDay = 2;
            user3.beersDrank = 18;
            user3.savedBeers = demoUser3SavedBeers;
            user3.profileImage = demoUserProfileImagePath3; // Unconditionally set for existing
            await user3.save();
            console.log('✅ DemoUser3 updated.');
        }
        const demoUserProfileImagePath4 = '/images/demo4-profile-pic.jpg'; // Same as DemoUser1
        const demoUser4SavedBeers = ["121601", "100187", "112897", "100087", "134620", "118161", "102102"];
        let user4 = await User.findOne({ username: 'DemoUser4' });
        if (!user4) {
            user4 = new User({
                username: 'DemoUser4',
                email: 'demo4@example.com',
                password: await bcrypt.hash('demopassword4', saltRounds),
                followers: 78,
                following: 22,
                beersPerDay: 5,
                beersDrank: 150,
                savedBeers: demoUser4SavedBeers,
                profileImage: demoUserProfileImagePath4
            });
            await user4.save();
            console.log('✅ DemoUser4 created.');
        } else {
            user4.followers = 78;
            user4.following = 22;
            user4.beersPerDay = 5;
            user4.beersDrank = 150;
            user4.savedBeers = demoUser4SavedBeers;
            user4.profileImage = demoUserProfileImagePath4;
            await user4.save();
            console.log('✅ DemoUser4 updated.');
        }

        // --- NEW: DemoUser 5 Setup ---
        const demoUserProfileImagePath5 = '/images/demo5-profile-pic.jpg'; // Same as DemoUser1
        const demoUser5SavedBeers =  ["134620", "102102", "100087", "118161", "112897", "121601", "100187"];
        let user5 = await User.findOne({ username: 'DemoUser5' });
        if (!user5) {
            user5 = new User({
                username: 'DemoUser5',
                email: 'demo5@example.com',
                password: await bcrypt.hash('demopassword5', saltRounds),
                followers: 105,
                following: 60,
                beersPerDay: 8,
                beersDrank: 280,
                savedBeers: demoUser5SavedBeers,
                profileImage: demoUserProfileImagePath5
            });
            await user5.save();
            console.log('✅ DemoUser5 created.');
        } else {
            user5.followers = 105;
            user5.following = 60;
            user5.beersPerDay = 8;
            user5.beersDrank = 280;
            user5.savedBeers = demoUser5SavedBeers;
            user5.profileImage = demoUserProfileImagePath5;
            await user5.save();
            console.log('✅ DemoUser5 updated.');
        }
        return 'All demo users created/updated successfully!'; // Return a success message
    } catch (err) {
        console.error('Error setting up demo users:', err);
        throw new Error('Error setting up demo users: ' + err.message); // Re-throw the error
    }
}

module.exports = setupUsers; // Export the function

