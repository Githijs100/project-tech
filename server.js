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

// Start de server
app.listen(port, () => {
    console.log(`🚀 Server draait op http://localhost:${port}`);
});

document.addEventListener("DOMContentLoaded", function () {
    let beerData = [];
    let currentStep = 0;
    let userChoices = {};

    async function loadBeers() {
        try {
            const response = await fetch("bieren.json"); // Zorg dat dit bestand correct is!
            beerData = await response.json();
            showQuestion();
        } catch (error) {
            console.error("Fout bij laden van de bieren:", error);
        }
    }

    function showQuestion() {
        const quizContainer = document.getElementById("quiz");
        quizContainer.innerHTML = "";

        const questionData = [
            {
                text: "Wat voor eten heb je zin in?",
                options: ["Vlees", "Vis", "Vega"],
                key: "foodPairing"
            },
            {
                text: "Uit welk land wil je dat het biertje komt?",
                options: [...new Set(beerData.map(beer => beer.land))],
                key: "land"
            },
            {
                text: "Wil je een mild (<7%) of een sterk biertje (>7%)?",
                options: ["Mild", "Sterk"],
                key: "alcohol"
            },
            {
                text: "Welke biersoort wil je proberen?",
                options: [...new Set(beerData.map(beer => beer.categorie))],
                key: "categorie"
            }
        ];

        if (currentStep < questionData.length) {
            const question = questionData[currentStep];
            const questionEl = document.createElement("h3");
            questionEl.textContent = question.text;
            quizContainer.appendChild(questionEl);

            question.options.forEach(option => {
                const button = document.createElement("button");
                button.textContent = option;
                button.onclick = () => {
                    userChoices[question.key] = option;
                    currentStep++;
                    showQuestion();
                };
                quizContainer.appendChild(button);
            });
        } else {
            showResult();
        }
    }

    function showResult() {
        const quizContainer = document.getElementById("quiz");
        quizContainer.innerHTML = "<h3>Jouw aanbevolen bier:</h3>";

        let filteredBeers = beerData.filter(beer =>
            (!userChoices.foodPairing || beer.foodPairing.includes(userChoices.foodPairing)) &&
            (!userChoices.land || beer.land === userChoices.land) &&
            (!userChoices.alcohol || (userChoices.alcohol === "Mild" ? beer.alcohol < 7 : beer.alcohol >= 7)) &&
            (!userChoices.categorie || beer.categorie === userChoices.categorie)
        );

        if (filteredBeers.length > 0) {
            const recommendedBeer = filteredBeers[Math.floor(Math.random() * filteredBeers.length)];
            quizContainer.innerHTML += `<p>${recommendedBeer.naam} uit ${recommendedBeer.land} - ${recommendedBeer.alcohol}% - ${recommendedBeer.categorie}</p>`;
        } else {
            quizContainer.innerHTML += "<p>Geen passende bieren gevonden. Probeer andere keuzes!</p>";
        }
    }

    loadBeers();
});

