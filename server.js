const express = require('express');
const app = express();
<<<<<<< HEAD
const { MongoClient } = require('mongodb');

// Middleware om formulierdata te parseren
app.use(express.urlencoded({ extended: true }));

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

// Stel de poort in (8000)
const port = 8000;

app.post('/registreren', async (req, res) => {
    const { username, email, password, date } = req.body;
    
    console.log(username, email, password, date);  // Controleer de ontvangen gegevens

    try {
        // Verbinding maken met MongoDB
        await client.connect();
        const db = client.db("mijnDatabase");
        const collectie = db.collection("gebruikers");

        // Document toevoegen aan de collectie
        const result = await collectie.insertOne({
            username,
            email,
            password,  // Vergeet niet om wachtwoorden veilig op te slaan, bijvoorbeeld met bcrypt
            date
        });

        console.log("Document toegevoegd:", result); // Toont het resultaat van de insert

        // Haal de gebruikers op
        const gebruikers = await collectie.find().toArray();
        
        res.send('Registratie succesvol!');
        res.render('gebruikers', { gebruikers });
    } catch (err) {
        console.error("Fout bij het opslaan van de gegevens:", err);
        res.status(500).send('Er is iets mis gegaan bij het opslaan van je gegevens');
    } finally {
        // Sluit de MongoDB-verbinding
        await client.close();
    }
});


// Stel EJS in als de template engine
app.set('view engine', 'ejs');

// Route voor de homepagina (Hello World)
app.get('/hello', (req, res) => {
    res.send('<h1>Hello World</h1>');
=======

// Stel EJS in als de template engine
app.set('view engine', 'ejs');
app.use(express.static('public'));


// Route voor de homepagina (Hello World)
app.get('/', (req, res) => {
    res.render('index');
>>>>>>> 76ad41e66a715a731ae3145e4c2f23cd63de0ab9
});

// Route voor de loginpagina
app.get('/login', (req, res) => {
    res.render('login', { title: "Loginpagina", message: "Welkom op mijn website" });
});

<<<<<<< HEAD
=======
// Start de server op poort 8000
app.listen(8000, () => {
    console.log('Server draait op http://localhost:8000');
});

>>>>>>> 76ad41e66a715a731ae3145e4c2f23cd63de0ab9
// Route voor de registreerpagina
app.get('/registreren', (req, res) => {
    res.render('registreren', { title: "Registreer", message: "Maak een nieuw account aan" });
});

<<<<<<< HEAD
// Start de server op de gedefinieerde poort
app.listen(port, () => {
    console.log(`Server draait op http://localhost:${port}`);
=======
// Route om het registratieformulier te verwerken
app.post('/registreren', (req, res) => {
    res.send("Registratie succesvol! (Hier kun je de gegevens opslaan in een database)");
>>>>>>> 76ad41e66a715a731ae3145e4c2f23cd63de0ab9
});
