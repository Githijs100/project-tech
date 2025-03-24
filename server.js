const express = require('express');
const app = express();

// Stel EJS in als de template engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

require('dotenv').config(); // Laad de omgevingsvariabelen
const uri = process.env.URI;
const { MongoClient } = require('mongodb');
const client = new MongoClient(uri);
const mongoose = require('mongoose');
const User = require('./models/user');


const bcrypt = require('bcrypt');
const saltRounds = 10;
const port = 8000;

// Verbinden met MongoDB bij het starten van de server
async function connectDB() {
    try {
        await mongoose.connect(uri);
        console.log("Verbonden met MongoDB via Mongoose");
    } catch (err) {
        console.error("Kan niet verbinden met MongoDB:", err);
        process.exit(1);
    }
}

connectDB();

// Middleware om formulierdata te parseren
app.use(express.urlencoded({ extended: true }));

app.post('/registreren', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.send("Gebruiker geregistreerd met versleuteld wachtwoord!");
    } catch (err) {
        res.status(500).send("Fout bij registratie: " + err.message);
    }
});

// Stel EJS in als template engine
app.set('view engine', 'ejs');

// Routes
app.get('/hello', (req, res) => {
    res.send('<h1>Hello World</h1>');
});

app.get('/login', (req, res) => {
    res.render('login', { title: "Loginpagina", message: "Welkom op mijn website" });
});

app.get('/registreren', (req, res) => {
    res.render('registreren', { title: "Registreer", message: "Maak een nieuw account aan" });
});

// Start de server
app.listen(port, () => {
    console.log(`🚀 Server draait op http://localhost:${port}`);
});


// Route voor de homepagina (Hello World)
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/quizen', (req, res) => {
    const quizzes = [
        { title: 'Persoonlijkheid' },
        { title: 'Spirit-Animal' },
        { title: 'Historisch figuur' },
        { title: 'Muzieksmaak' },
      ];
      res.render('quizen', { quizzes: quizzes });
});
app.get('/profiel', (req, res) => {
    res.render('profiel');
});
app.get('/feed', (req, res) => {
    res.render('feed');
});


// Route voor de loginpagina
app.get('/login', (req, res) => {
    res.render('login', { title: "Loginpagina", message: "Welkom op mijn website" });
});

// Start de server op poort 8000
app.listen(8000, () => {
    console.log('Server draait op http://localhost:8000');
});

// Route voor de registreerpagina
app.get('/registreren', (req, res) => {
    res.render('registreren', { title: "Registreer", message: "Maak een nieuw account aan" });
});

// Route om het registratieformulier te verwerken
app.post('/registreren', (req, res) => {
    res.send("Registratie succesvol! (Hier kun je de gegevens opslaan in een database)");
});
