require('dotenv').config(); // Laad de omgevingsvariabelen
const express = require('express');
const app = express();

// Stel EJS in als template engine
app.set('view engine', 'ejs');
app.use(express.static('public'));


// Routes
app.get('/', (req, res) => {
    res.render('index');
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
