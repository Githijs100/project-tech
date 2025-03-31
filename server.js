require('dotenv').config(); // Laad de omgevingsvariabelen
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const uri = process.env.URI;
const client = new MongoClient(uri);
const port = 8000;

// Verbinden met MongoDB bij het starten van de server
async function connectDB() {
    try {
        await client.connect();
        console.log("Verbonden met MongoDB");
    } catch (err) {
        console.error("Kan niet verbinden met MongoDB:", err);
        process.exit(1);
    }
}
connectDB();

// Middleware om formulierdata te parseren
app.use(express.urlencoded({ extended: true }));

app.post('/registreren', async (req, res) => {
    try {
        const db = client.db("mijnDatabase");
        const collectie = db.collection("gebruikers");

        const { username, email, password, date } = req.body;
        console.log(username, email, password, date);

        const result = await collectie.insertOne({ username, email, password, date });
        console.log("Document toegevoegd:", result);

        const gebruikers = await collectie.find().toArray();
        res.render('gebruikers', { gebruikers });
    } catch (err) {
        console.error("Fout bij opslaan:", err);
        res.status(500).send("Er is iets misgegaan.");
    }
});

// Stel EJS in als template engine
app.set('view engine', 'ejs');

// Routes
app.get('/hello', (req, res) => {
    res.send('<h1>Hello World</h1>');
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

app.get('/registreren', (req, res) => {
    res.render('registreren', { title: "Registreer", message: "Maak een nieuw account aan" });
});


app.get('/testquiz', (req, res) => {
    res.render('testquiz', { title: "TestQuiz", message: "Doe de Quiz!" });
});

// Start de server
app.listen(port, () => {
    console.log(`🚀 Server draait op http://localhost:${port}`);
});

