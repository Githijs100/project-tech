const express = require('express');
const app = express();
const { MongoClient } = require ('mongodb');

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        const db = client.db("mijnDatabase");
        const collectie = db.collection("gebruikers");

        await collectie.insertOne({
            username,
            email,
            password,
            leeftijd
        });


        res.send("Gebruiker succesvol geregistreerd!");
    } catch (err) {
        console.error("Fout bij registratie:", err);
        res.status(500).send("Er is een fout opgetreden.");
    } finally {
        await client.close();
    }
};

// Start de server
app.listen(port, () => {
    console.log(`Server draait op http://localhost:${port}`);
});


run().catch(console.error);

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
