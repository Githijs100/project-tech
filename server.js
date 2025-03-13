const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');

// Middleware om formulierdata te parseren
app.use(express.urlencoded({ extended: true }));

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

// Stel de poort in (8000)
const port = 8000;

app.post('/registreren', async (req, res) => {
    // Haal de gegevens uit req.body
    const { username, email, password, date } = req.body;

    console.log(username);  // Waarde van 'username' uit het formulier
    console.log(email);     // Waarde van 'email' uit het formulier
    console.log(date);      // Waarde van 'date' uit het formulier

    try {
        // Verbinden met de MongoDB database
        await client.connect();
        const db = client.db("mijnDatabase");
        const collectie = db.collection("gebruikers");

        // Document toevoegen aan de collectie
        await collectie.insertOne({
            username,
            email,
            password,  // Vergeet niet om wachtwoorden veilig op te slaan, bijvoorbeeld met bcrypt
            date
        });

        const gebruikers = await collectie.find().toArray();

        res.send('Registratie succesvol!');

        res.render('gebruikers', { gebruikers });
    } catch (err) {
        console.error("Fout bij het opslaan van de gegevens:", err);
        res.status(500).send('Er is iets mis gegaan bij het opslaan van je gegevens');
    } finally {
        // Sluit de MongoDB verbinding
        await client.close();
    }
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

// Start de server op de gedefinieerde poort
app.listen(port, () => {
    console.log(`Server draait op http://localhost:${port}`);
});
