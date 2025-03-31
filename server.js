const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');

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
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('✅ Verbonden met MongoDB via Mongoose');
    } catch (err) {
        console.error('❌ Kan niet verbinden met MongoDB:', err);
        process.exit(1);
    }
}

connectDB();

// Routes
app.get('/', (req, res) => res.render('index'));
app.get('/quiz', (req, res) => res.render('quiz'));
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
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send("❌ Ongeldige inloggegevens");
        }
        req.session.userId = user._id;
        res.redirect('/profiel');
    } catch (err) {
        res.status(500).send("❌ Fout bij inloggen: " + err.message);
    }
});

// ✅ Uitlog Route
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

// Route voor de quizpagina
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

// Server Start
app.listen(port, () => {
    console.log(`Server draait op http://localhost:${port}`);
});


