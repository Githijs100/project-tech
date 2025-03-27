const express = require('express');
const app = express();



// Stel EJS in als de template engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Start de server op poort 8000
app.listen(8000, () => {
    console.log('Server draait op http://localhost:8000');
});

const dotenv = require("dotenv")
dotenv.config()

const apiKey = process.env.API_KEY;
console.log("API key:", apiKey)

app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    res.locals.navItems = [
      { path: '/feed', label: 'Feed', activeImage: 'images/feed-act.png', inactiveImage: 'images/feed-inact.png' },
      { path: '/', label: 'Home', activeImage: 'images/home-act.png', inactiveImage: 'images/home-inact.png' },
      { path: '/profiel', label: 'Profile', activeImage: 'images/profile-act.png', inactiveImage: 'images/profile-inact.png' }
    ];
    next();
  });

// Route voor de homepagina (Hello World)
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/quiz', (req, res) => {
    res.render('index');
      res.render('quiz');
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


// Route voor de registreerpagina
app.get('/registreren', (req, res) => {
    res.render('registreren', { title: "Registreer", message: "Maak een nieuw account aan" });
});

// Route om het registratieformulier te verwerken
app.post('/registreren', (req, res) => {
    res.send("Registratie succesvol! (Hier kun je de gegevens opslaan in een database)");
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
