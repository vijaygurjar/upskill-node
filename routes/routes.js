const express = require('express')
const session = require('express-session')
const db = require('../config/database').connect()
const passport = require('passport')
const User = require('../model/user')
const jwt = require("jsonwebtoken")
const auth = require('../middleware/auth')
const userRoutes = require('./user-routes')
const productRoutes = require('./product-routes')
const userController = require('../controller/user.controller');
const tokenSchema = require('../model/token')

const routes = express();

routes.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
routes.use(express.json());

routes.use(session({
  cookie:{
    secure: true,
    maxAge:60000
  },
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET
}))

routes.use(passport.initialize());
routes.use(passport.session());

routes.use(ignoreFavicon);

routes.use('/api/user', userRoutes);

routes.use('/api/product', productRoutes);

routes.post("/api/login", userController.login);

routes.get("/api/googlelogout", userController.googleLogout);

routes.post("/api/logout", userController.logout);

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: process.env.GOOGLE_REDIRECT
},
  async (accessToken, refreshToken, profile, done) => {
    const newUser = {
      googleid: profile.id,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      email: profile.emails[0].value,
      pic: profile.photos[0].value,
      status: true,
      gender: profile.gender
    };

    try {
      let user = await User.findOne({ email: newUser.email });
      if (user) {
        done(null, newUser);
      } else {
        user = await User.create(newUser);
        const token = jwt.sign(
          { _id: user._id, email: newUser.email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "10d",
          }
        );

        userToken = await tokenSchema.create({ id: user._id, googleid: profile.id, token: token });
        newUser.token = token;
        done(null, newUser);
      }
    } catch (err) {
      console.log(err);
    }
  }
))

routes.get('/loginerror', (req, res) => {
  res.send('error in login')
})

routes.get('/', function (req, res) {
  res.status(301).redirect("/auth/google");
})

routes.get('/welcome', auth, function (req, res) {
  res.status(200).send('Welcome to my world')
})

routes.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

routes.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/loginerror' }), (req, res) => {
  res.json({
    'user': req.user, 'token': req.user.token
  })
});

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

function ignoreFavicon(req, res, next) {
  if (req.originalUrl.includes('favicon.ico')) {
    res.status(204).end()
  }
  next();
}

module.exports = routes;