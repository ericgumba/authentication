const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./config/keys');


console.log(keys.googleClientID);
passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
}, accessToken => { console.log(accessToken) }));



const app = express();

app.get('/', (req, res) => {
    res.send('<p> some html </p>');
});



// set passport middleware
app.use(passport.initialize());
app.use(passport.session());


app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
}));

app.get('/auth/google/callback', passport.authenticate('google'));



app.listen(5000);