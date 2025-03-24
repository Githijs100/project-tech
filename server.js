const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const fetch = require('node-fetch'); // Nodig voor API-aanroepen
require('dotenv').config(); // Laad omgevingsvariabelen

const app = express();
const port = process.env.PORT || 8000;
const uri = process.env.URI;
const apiKey = process.env.API_KEY; // Zorg ervoor dat deze in .env staat!
const User = require('./models/user');
const saltRounds = 10;

// Stel EJS in als template engine
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // Middleware om formulierdata te parseren

// ✅ Verbinden met MongoDB bij het starten van de server
async function connectDB() {
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("✅ Verbonden met MongoDB via Mongoose");
    } catch (err) {
        console.error("❌ Kan niet verbinden met MongoDB:", err);
        process.exit(1);
    }
}
connectDB();

// ✅ Routes
app.get('/', (req, res) => res.render('index'));
app.get('/hello', (req, res) => res.send('<h1>Hello World</h1>'));
app.get('/login', (req, res) => res.render('login', { title: "Loginpagina", message: "Welkom op mijn website" }));
app.get('/registreren', (req, res) => res.render('registreren', { title: "Registreer", message: "Maak een nieuw account aan" }));
app.get('/profiel', (req, res) => res.render('profiel'));
app.get('/feed', (req, res) => res.render('feed'));

// ✅ Quiz route
app.get('/quizen', (req, res) => {
    const quizzes = [
        { title: 'Persoonlijkheid' },
        { title: 'Spirit-Animal' },
        { title: 'Historisch figuur' },
        { title: 'Muzieksmaak' },
    ];
    res.render('quizen', { quizzes });
});

// ✅ Registratie Route
app.post('/registreren', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.send("✅ Gebruiker geregistreerd met versleuteld wachtwoord!");
    } catch (err) {
        res.status(500).send("❌ Fout bij registratie: " + err.message);
    }
});

// ✅ Zoekfunctie API-integratie
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

        // ✅ Haal de beer data eruit (voorkom fouten als `result.data` niet bestaat)
        const beers = result?.data && Array.isArray(result.data) ? result.data : [];

        if (beers.length === 0) {
            console.log("Geen resultaten gevonden");
            return res.render('results', { beers: [], query });
        }

        console.log('Beers data:', beers);

        // ✅ Render de resultatenpagina met de data
        res.render('results', { beers, query });

    } catch (error) {
        console.error('API error:', error.message);
        res.status(500).send('❌ Er ging iets mis bij het ophalen van de bieren...');
    }
});

// ✅ Start de server (maar **slechts één keer**!)
app.listen(port, () => {
    console.log(`🚀 Server draait op http://localhost:${port}`);
});
