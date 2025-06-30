const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const Beer = require("./models/beerModel"); // Zorg ervoor dat je een Beer-model hebt
const https = require('https');
const fs = require('fs');

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
const uri = process.env.URI;
const apiKey = process.env.API_KEY;
const User = require('./models/user');
const saltRounds = 10;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Jouw routes en middleware hier...


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
app.get('/', (req, res) => res.render('index'));
app.get('/testquiz', (req, res) => res.render('testquiz'));
app.get('/profiel', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.redirect('/login');
        }
        res.render('profiel', { username: user.username, email: user.email });
    } catch (err) {
        console.error('❌ Fout bij ophalen profiel:', err);
        res.status(500).send('Er is een fout opgetreden.');
    }
});
// ✅ Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).render('login', { foutmelding: "❌ Ongeldige inloggegevens,<br> biertje teveel op?🥴" });
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

app.get('/feed', (req, res) => res.render('feed'));
app.get('/login', (req, res) => res.render('login', { title: 'Loginpagina', message: 'Welkom op mijn website' }));
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
    console.log("📩 Ontvangen login request met:", req.body);

    try {
        const user = await User.findOne({ username });
        if (!user) {
            console.log("❌ Geen gebruiker gevonden voor username:", name);
            return res.status(401).send("Ongeldige inloggegevens");
        }

        console.log("✅ Gebruiker gevonden:", user.username);

        const match = await bcrypt.compare(password, user.password);
        console.log("🔑 Wachtwoord correct?", match);

        if (!match) {
            console.log("❌ Wachtwoord komt niet overeen.");
            return res.status(401).send("Ongeldige inloggegevens");
        }

        req.session.userId = user._id;
        console.log("✅ Inloggen gelukt! Gebruiker ID:", user._id);
        res.redirect('/profiel');
    } catch (err) {
        console.error("❌ Fout bij inloggen:", err);
        res.status(500).send("Interne serverfout");
    }
});

app.get('/profiel', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login'); // Stuur gebruiker naar login als hij niet is ingelogd
    }

    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.redirect('/login');
        }

        console.log("✅ Gebruiker gevonden:", user.username, user.email); // Debug info

         // Stuur de gebruiker naar het profiel en geef de opgeslagen bieren mee
         res.render('profiel', { user, savedBeers: user.savedBeers });

        res.render('profiel', { user }); // Stuur user naar EJS
    } catch (err) {
        console.error("❌ Fout bij ophalen profiel:", err);
        res.status(500).send("Interne serverfout");
    }
});

// Server Start
app.listen(port, () => {
    console.log(`Server draait op http://localhost:${port}`);
});

