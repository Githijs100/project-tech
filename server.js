const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');
const dotenv = require('dotenv');
const User = require('./models/user');

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
const mongoUri = process.env.URI;
const saltRounds = 10;

// Connectie met MongoDB
mongoose.connect(mongoUri)
    .then(() => console.log("✅ Verbonden met MongoDB"))
    .catch((err) => {
        console.error("❌ MongoDB fout:", err);
        process.exit(1);
    });

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET || 'geheim',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Zet true als je HTTPS gebruikt
}));

// ✅ GET: Loginpagina
app.get('/login', (req, res) => {
    res.render('login', {
        title: 'Inloggen',
        message: 'Welkom terug!',
        foutmelding: null
    });
});

// ✅ POST: Inloggen
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).render('login', {
                title: 'Inloggen',
                message: 'Welkom terug!',
                foutmelding: '❌ Ongeldige inloggegevens,<br> biertje teveel op?🥴'
            });
        }

        req.session.userId = user._id;
        res.redirect('/profiel');
    } catch (err) {
        res.status(500).render('login', {
            title: 'Inloggen',
            message: 'Welkom terug!',
            foutmelding: '❌ Fout bij inloggen: ' + err.message
        });
    }
});

// ✅ GET: Registratiepagina
app.get('/registreren', (req, res) => {
    res.render('registreren', {
        title: 'Registreren',
        foutmelding: null
    });
});

// ✅ POST: Registreren
app.post('/registreren', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).render('registreren', {
                title: 'Registreren',
                foutmelding: '❌ Gebruikersnaam is al in gebruik.'
            });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        req.session.userId = newUser._id;
        res.redirect('/profiel');
    } catch (err) {
        res.status(500).render('registreren', {
            title: 'Registreren',
            foutmelding: '❌ Fout bij registratie: ' + err.message
        });
    }
});

// ✅ GET: Profielpagina
app.get('/profiel', async (req, res) => {
    if (!req.session.userId) return res.redirect('/login');

    const user = await User.findById(req.session.userId);
    if (!user) return res.redirect('/login');

    res.render('profiel', {
        username: user.username,
        email: user.email
    });
});

// ✅ GET: Logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

app.listen(port, () => {
    console.log(`🚀 Server draait op http://localhost:${port}`);
});
