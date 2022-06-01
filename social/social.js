const express = require('express');
const app = express();
const session = require('express-session');
const db = require('./db/config')

app.set('view engine', 'ejs');

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
}))

app.get('/', function(req, res) {
    res.render('pages/auth');
})

app.listen(5000, () => {
    console.log('server listning')
})

const passport = require('passport');
var userProfile;

app.use(passport.initialize());
app.use(passport.session());

// app.set('view engine', 'ejs');

app.get('/success', (req, res)=> {
    res.render('pages/success', {user: userProfile});
});
app.get('/error', (req, res) => {
    res.send('error in login')
})

passport.serializeUser(function(user, cb) {
    cb(null, user);
  });
   
  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
  });
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = "651612686281-atjir1on6ksfsim02rngjs2tg11fbs5e.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET= "_XNLKCyH5aES_O27qmns12jO"

passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:5000/auth/google/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        userProfile = profile;
        return done(null, userProfile);
    }
))

app.get('/auth/google',
    passport.authenticate('google', { scope : ['profile', 'email'] })
);

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/success');
  });
