const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config(); // Laad omgevingsvariabelen

const app = express();
const port = process.env.PORT || 8000;
const uri = process.env.URI;
const User = require('./models/user');
const saltRounds = 10;

// Stel EJS in als de template engine
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // Middleware om formulierdata te parseren

// Verbinden met MongoDB bij het starten van de server
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

// Routes
app.get('/', (req, res) => res.render('index'));
app.get('/hello', (req, res) => res.send('<h1>Hello World</h1>'));
app.get('/login', (req, res) => res.render('login', { title: "Loginpagina", message: "Welkom op mijn website" }));
app.get('/registreren', (req, res) => res.render('registreren', { title: "Registreer", message: "Maak een nieuw account aan" }));
app.get('/quizen', (req, res) => {
    const quizzes = [
        { title: 'Persoonlijkheid' },
        { title: 'Spirit-Animal' },
        { title: 'Historisch figuur' },
        { title: 'Muzieksmaak' },
    ];
    res.render('quizen', { quizzes });
});
app.get('/profiel', (req, res) => res.render('profiel'));
app.get('/feed', (req, res) => res.render('feed'));

// Registratie Route
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

// Start de server (✅ Slechts één keer app.listen!)
app.listen(port, () => {
    console.log(`🚀 Server draait op http://localhost:${port}`);
});
