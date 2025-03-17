require('dotenv').config(); // Laad de omgevingsvariabelen
const express = require('express');
const uri = process.env.URI;
const { MongoClient } = require('mongodb');
const client = new MongoClient(uri);
const mongoose = require('mongoose');
const User = require('./models/User');


const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express();
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