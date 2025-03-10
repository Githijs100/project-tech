const express = require('express');
const app = express();

app
    .get('/', onhome)
    .listen(8000)

app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    res.render('login', { title: "Loginpagina", message: "Welkom op mijn website" });
});
app.listen(8000)

function onhome(req, res) {
    res.send('<h1>Hello World</h1>')
}