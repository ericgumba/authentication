const express = require('express');
const passport = require('passport');


const app = express();

app.get('/', (req, res) => {
    res.send('<p> some html </p>');
});


app.listen(5000);