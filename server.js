const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');

// Middleware om formulierdata te parseren
app.use(express.urlencoded({ extended: true }));

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

// Stel de poort in (8000)
const port = 8000;

app.post('/registreren', (req, res) => {
    // Haal de gegevens uit req.body
    const { username, email, password, date } = req.body;

    console.log(username);  // Waarde van 'username' uit het formulier
    console.log(email);     // Waarde van 'email' uit het formulier
    console.log(date);

    res.send('Registratie succesvol!');
});


// Stel EJS in als de template engine
app.set('view engine', 'ejs');

// Route voor de homepagina (Hello World)
app.get('/hello', (req, res) => {
    res.send('<h1>Hello World</h1>');
});

// Route voor de loginpagina
app.get('/login', (req, res) => {
    res.render('login', { title: "Loginpagina", message: "Welkom op mijn website" });
});

// Route voor de registreerpagina
app.get('/registreren', (req, res) => {
    res.render('registreren', { title: "Registreer", message: "Maak een nieuw account aan" });
});

// Route om het registratieformulier te verwerken
app.post('/registreren', (req, res) => {
    // Zorg ervoor dat je hier de formuliervelden uit req.body haalt
    res.send("Registratie succesvol! (Hier kun je de gegevens opslaan in een database)");
});

// Start de server op de gedefinieerde poort
app.listen(port, () => {
    console.log(`Server draait op http://localhost:${port}`);
});

// Start de MongoDB run functie (om verbinding te maken met de database)
run().catch(console.error);
