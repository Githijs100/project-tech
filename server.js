const express = require('express');
const app = express();

// Stel EJS in als de template engine
app.set('view engine', 'ejs');
app.use(express.static('public'));


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
