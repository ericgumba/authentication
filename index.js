const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./config/keys');
const mongoose = require('mongoose');
require('./models/user'); // must be executed before User = mongoose.model('user')
const User = mongoose.model('users');
const cookie = require('cookie-session');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI);


const app = express();



app.use(
    cookie({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey],
    })
);


// set passport middleware
app.use(passport.initialize());
app.use(passport.session());


// PASSPORT 

passport.serializeUser((user, done) => {
    console.log("seralized")
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    console.log("deserialized")
    User.findById(id).then(user => {
        done(null, user);
    });
});


passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleId: profile.id }).then(
        existingUser => {
            // existingUser ? done(null, existingUser) :
            //     new User({ googleId: profile.id }).save().then(
            //         user => done(null, user)
            //     )
            if (existingUser) {
                done(null, existingUser);
            } else {
                new User({ googleId: profile.id }).save().then(
                    user => done(null, user)
                )
            }
        }
    )
}));


// ROUTING 

app.get('/', (req, res) => {
    res.send('<p> some html </p>');
});



app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

app.get('/auth/google/callback', passport.authenticate('google'));

app.get('/api/user', (req, res) => {
    res.send(req.user);
});



app.listen(5000);