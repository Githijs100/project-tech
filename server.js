// server.js

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const https = require('https');
const fetch = require('node-fetch');

const Beer = require('./models/beerModel');
const User = require('./models/user');

dotenv.config();

const app = express();
const port = 8443;
const uri = process.env.URI;
const apiKey = process.env.API_KEY;
const saltRounds = 10;


// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'geheim',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Zet op true in productie!
}));

// Navigatie-info beschikbaar maken in views
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  res.locals.navItems = [
    { path: '/feed', label: 'Feed', activeImage: 'images/feed-act.png', inactiveImage: 'images/feed-inact.png' },
    { path: '/', label: 'Home', activeImage: 'images/home-act.png', inactiveImage: 'images/home-inact.png' },
    { path: '/profiel', label: 'Profile', activeImage: 'images/profile-act.png', inactiveImage: 'images/profile-inact.png' }
  ];
  next();
});

// DB-connectie
mongoose.connect(uri)
  .then(() => console.log('✅ Verbonden met MongoDB'))
  .catch(err => {
    console.error('❌ Databasefout:', err);
    process.exit(1);
  });

// Routes
app.get('/', (req, res) => res.render('index'));

app.get('/login', (req, res) => {
  res.render('login', { foutmelding: null });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).render('login', {
        foutmelding: "❌ Ongeldige inloggegevens,<br> biertje teveel op?🥴"
      });
    }
    req.session.userId = user._id;
    res.redirect('/profiel');
  } catch (err) {
    res.status(500).render('login', { foutmelding: "❌ Fout bij inloggen: " + err.message });
  }
});

app.get('/registreren', (req, res) => {
  res.render('registreren', { foutmelding: null });
});

app.post('/registreren', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    req.session.userId = newUser._id;
    res.redirect('/profiel');
  } catch (err) {
    console.error('❌ Registratiefout:', err);
    res.status(500).send('Fout bij registratie');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

app.get('/profiel', async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  try {
    const user = await User.findById(req.session.userId);
    if (!user) return res.redirect('/login');
    res.render('profiel', { user, savedBeers: user.savedBeers });
  } catch (err) {
    console.error("❌ Fout bij ophalen profiel:", err);
    res.status(500).send("Interne serverfout");
  }
});

app.get('/feed', (req, res) => res.render('feed'));

app.get('/testquiz', (req, res) => res.render('testquiz'));

// Bier opslaan
app.post('/save-beer', async (req, res) => {
  const { beerId } = req.body;
  if (!req.session.userId) {
    return res.status(401).send("❌ Je moet ingelogd zijn om een bier op te slaan.");
  }

  try {
    const user = await User.findById(req.session.userId);
    if (!user) return res.status(404).send("❌ Gebruiker niet gevonden.");

    if (!user.savedBeers.includes(beerId)) {
      user.savedBeers.push(beerId);
      await user.save();
    }

    res.status(200).send({ message: "🍺 Biertje opgeslagen in favorieten!" });
  } catch (err) {
    console.error("❌ Fout bij opslaan van bier:", err);
    res.status(500).send("Er is een fout opgetreden bij het opslaan.");
  }
});

// Zoeken
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
    if (!response.ok) throw new Error(`API gaf een fout: ${response.status}`);
    const result = await response.json();
    const beers = Array.isArray(result.data) ? result.data : [];
    res.render('results', { beers, query });
  } catch (err) {
    console.error('API error:', err.message);
    res.status(500).send('Er ging iets mis bij het ophalen van de bieren...');
  }
});

// Start HTTPS-server
https.createServer(sslOptions, app).listen(port, () => {
  console.log(`✅ HTTPS server draait op https://localhost:${port}`);
});
