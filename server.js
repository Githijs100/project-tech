const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
const uri = process.env.URI;
const User = require('./models/user');
const saltRounds = 10;

// Middleware
app.set('view engine', 'ejs');
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