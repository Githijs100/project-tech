const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session'); // Nodig voor sessies
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;
const uri = process.env.URI;
const apiKey = process.env.API_KEY;
const User = require('./models/user');
const saltRounds = 10;

// Stel EJS in als template engine
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// ✅ Sessiemiddleware instellen
app.use(session({
    secret: 'geheim', // Zorg ervoor dat je een veilige key gebruikt in productie!
    resave: false,
    saveUninitialized: false
}));

// ✅ Verbinden met MongoDB
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
app.get('/login', (req, res) => res.render('login', { title: "Loginpagina", message: "Welkom op mijn website" }));
app.get('/registreren', (req, res) => res.render('registreren', { title: "Registreer", message: "Maak een nieuw account aan" }));

// ✅ Registratie Route
app.post('/registreren', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        // ✅ Sla de gebruiker op in de sessie
        req.session.userId = newUser._id;

        // ✅ Doorsturen naar profielpagina
        res.redirect('/profiel');
    } catch (err) {
        res.status(500).send("❌ Fout bij registratie: " + err.message);
    }
});

// ✅ Profielpagina route (gebruiker moet ingelogd zijn)
app.get('/profiel', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login'); // ✅ Voorkom ongeautoriseerde toegang
    }

    try {
        const user = await User.findById(req.session.userId);

        if (!user) {
            return res.redirect('/login');
        }

        res.render('profiel', { username: user.username, email: user.email });
    } catch (err) {
        console.error('❌ Fout bij ophalen van profiel:', err);
        res.status(500).send('Er is een fout opgetreden.');
    }
});

// ✅ Start de server
app.listen(port, () => {
    console.log(`🚀 Server draait op http://localhost:${port}`);
});
