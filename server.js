const express = require('express');
const app = express();

app
    .get('/', onhome)
    .listen(8000)

function onhome(req, res) {
    res.send('<h1>Hello World</h1>')
}