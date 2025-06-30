const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const Beer = require("./models/beerModel");
const User = require('./models/user');
const Post = require('./models/postModel');
const fs = require('fs');          
const https = require('https'); 


// --- NEW: Import setup scripts ---
const setupUsers = require('./scripts/setupUsers');
const setupPosts = require('./scripts/setupPosts');
// --- END NEW ---

// --- NEW DEBUG LOG ---
console.log('Type of setupUsers:', typeof setupUsers);
console.log('Type of setupPosts:', typeof setupPosts);
// --- END NEW DEBUG LOG ---

const sslOptions = {
    key: fs.readFileSync('./ssl/key.pem'),
    cert: fs.readFileSync('./ssl/cert.pem')
  };

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
const uri = process.env.URI;
const apiKey = process.env.API_KEY;

const saltRounds = 10;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Sessieconfiguratie
app.use(session({
    secret: process.env.SESSION_SECRET || 'geheim', // Gebruik een veilige secret in productie
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' } // Secure cookie in productie
}));

// Navigatie Middleware
app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    res.locals.navItems = [
        { path: '/feed', label: 'Feed', activeImage: 'images/feed-act.png', inactiveImage: 'images/feed-inact.png' },
        { path: '/', label: 'Home', activeImage: 'images/home-act.png', inactiveImage: 'images/home-inact.png' },
        { path: '/profiel', label: 'Profile', activeImage: 'images/profile-act.png', inactiveImage: 'images/profile-inact.png' }
    ];
    next();
});

// Database Connectie
async function connectDB() {
    try {
        await mongoose.connect(uri);
        console.log('✅ Verbonden met MongoDB via Mongoose');
    } catch (err) {
        console.error('❌ Kan niet verbinden met MongoDB:', err);
        process.exit(1);
    }
}
connectDB();

// Routes

// --- NEW: Admin routes to trigger setup scripts ---
app.get('/admin/setup-users', async (req, res) => {
    try {
        const message = await setupUsers(); // Call the function from your script
        res.send(message);
    } catch (err) {
        console.error('❌ Error setting up demo users:', err);
        res.status(500).send('Error setting up demo users: ' + err.message);
    }
});

app.get('/admin/setup-posts', async (req, res) => {
    try {
        const message = await setupPosts(); // Call the function from your script
        res.send(message);
    } catch (err) {
        console.error('❌ Error setting up posts:', err);
        res.status(500).send('Error setting up posts: ' + err.message);
    }
});
// --- END NEW: Admin routes ---


app.get('/', (req, res) => res.render('index'));
app.get('/testquiz', (req, res) => res.render('testquiz'));


// ***** CORRECTED /profiel ROUTE - ADDED THE MISSING `favoriteBeers` DEFINITION LINE *****
app.get('/profiel', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login'); // Redirect to login if user is not logged in
    }

    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            console.warn(`User with ID ${req.session.userId} not found, redirecting to login.`);
            return res.redirect('/login');
        }

        console.log("✅ Gebruiker gevonden:", user.username, user.email); // Debug info
        // --- START NEW DEBUG LOGS ---
        console.log("🔍 user.savedBeers:", user.savedBeers); // Log what SKUs are in the user's savedBeers

        // Fetch the actual Beer documents based on the SKUs stored in user.savedBeers
        const favoriteBeers = await Beer.find({ sku: { $in: user.savedBeers } });

        console.log("🍺 Aantal favoriteBeers gevonden:", favoriteBeers.length); // Log how many beers were found
        console.log("🍻 Eerste favoriteBeer (ter controle):", favoriteBeers.length > 0 ? favoriteBeers[0] : "Geen bieren gevonden."); // Log the first found beer
        // --- END NEW DEBUG LOGS ---

        // Render the profile page, passing ALL necessary data with correct variable names
        res.render('profiel', {
            username: user.username,
            email: user.email,
            followers: user.followers || 0,
            following: user.following || 0,
            beersPerDay: user.beersPerDay || 0,
            beersDrank: user.beersDrank || 0,
            favoriteBeers: favoriteBeers,
            profileImage: user.profileImage || '/images/user2-logo.png'
        });

    } catch (err) {
        console.error("❌ Fout bij ophalen profiel:", err);
        res.status(500).send("Interne serverfout bij ophalen profiel.");
    }
});
// ***** END OF CORRECTED /profiel ROUTE *****


// routes voor opslaan van een bier in het profiel van de gebruiker
app.post('/save-beer', async (req, res) => {
    const { beerId } = req.body; // Het bier dat we willen opslaan

    if (!req.session.userId) {
        return res.status(401).send("❌ Je moet ingelogd zijn om een bier op te slaan.");
    }

    try {
        // Zoek de gebruiker in de database
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(404).send("❌ Gebruiker niet gevonden.");
        }

        user.savedBeers.push(beerId);

        // Sla de gebruiker op met het bijgewerkte profiel
        await user.save();
        res.status(200).send({ message: "🍺 Biertje opgeslagen in favorieten!" });
    } catch (err) {
        console.error("❌ Fout bij opslaan van bier:", err);
        res.status(500).send("❌ Er is een fout opgetreden bij het opslaan.");
    }
});


// ✅ Uitlog Route
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});


app.get('/testquiz', (req, res) => {
    res.render('testquiz', { title: "TestQuiz", message: "Doe de Quiz!" });
});

app.get('/search', async (req, res) => {
    const query = req.query.query;

    if (!query || !query.trim()) {
        return res.render('results', { beers: [], query: 'Geen zoekterm opgegeven' });
    }

    const url = `https://beer9.p.rapidapi.com/?name=${encodeURIComponent(query)}`;


    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'beer9.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`API gaf een fout: ${response.status}`);
        }
        

        const result = await response.json();
        console.log('API Response:', JSON.stringify(result, null, 2));

        // Check of de data goed is en haal de echte beer data eruit
        const beers = result.data && Array.isArray(result.data) ? result.data : [];

        if (beers.length === 0) {
            console.log("Geen resultaten gevonden");
            return res.render('results', { beers: [], query });
        }

        console.log('Beers data:', beers);

        // Render de resultatenpagina met de data
        res.render('results', { beers, query });

    } catch (error) {
        console.error('API error:', error.message);
        res.status(500).send('Er ging iets mis bij het ophalen van de bieren...');
    }
});

// --- Update existing /feed route for randomization ---
app.get('/feed', async (req, res) => {
    try {
        // Fetch all posts from the database
        let posts = await Post.find(); // No sorting here initially

        // --- NEW: Randomize the order of posts using Fisher-Yates (Knuth) shuffle algorithm ---
        for (let i = posts.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [posts[i], posts[j]] = [posts[j], posts[i]]; // Swap elements
        }
        // --- END NEW ---

        console.log(`✅ Fetched and randomized ${posts.length} posts for the feed.`);
        res.render('feed', { posts: posts }); // Pass the randomized posts to the EJS template
    } catch (err) {
        console.error('❌ Error fetching posts for feed:', err);
        res.status(500).send("Interne serverfout bij ophalen van de feed.");
    }
});
// --- END Update existing /feed route ---


app.get('/registreren', (req, res) => res.render('registreren', { title: 'Registreer', message: 'Maak een nieuw account aan' }));

// Registratie Route
app.post('/registreren', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        req.session.userId = newUser._id;
        res.redirect('/profiel');
    } catch (err) {
        console.error('❌ Fout bij registratie:', err);
        res.status(500).send('❌ Fout bij registratie: ' + err.message);
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).render('login', { foutmelding: "❌ Ongeldige inloggegevens <br> Biertje teveel op?🥴" });
        }
        req.session.userId = user._id;
        res.redirect('/profiel');
    } catch (err) {
        res.status(500).render('login', { foutmelding: "❌ Fout bij inloggen: " + err.message });
    }

});

app.get('/login', (req, res) => {
    res.render('login', { foutmelding: null });
});


// Server Start
//app.listen(port, () => {
    //console.log(`Server draait op http://localhost:${port}`);
    https.createServer(sslOptions, app).listen(8443, () => {
        console.log('✅ HTTPS-server draait op https://localhost:8443');
    });

