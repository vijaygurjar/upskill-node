require("dotenv").config();
var cookieParser = require('cookie-parser');
var csrf = require('csurf');
const express = require('express');
const db = require('../config/database').connect();
const User = require('../model/user');
const bodyParser = require('body-parser')
const jwt = require("jsonwebtoken");

const auth = require('../middleware/auth');
const { s3FileUpload, s3ProductPicUpload} = require('../middleware/s3');
const userController = require('../controller/user.controller');
const productController = require('../controller/product.controller');
const passport = require('passport');
const session = require('express-session');
const tokenSchema = require('../model/token');

// setup route middlewares
var csrfProtection = csrf({ cookie: true })
var parseForm = bodyParser.urlencoded({ extended: false })

const app = express();

app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.set('view engine', 'ejs');

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser())

//Security call for learning
app.get('/csrf', csrfProtection, function (req, res) {
  // pass the csrfToken to the view
  let csrftoken = req.csrfToken();
  res.send(`
    <html>
    <form id="myForm" action="/transfer" method="POST" target="_self">
    Account:<input type="text" name="account" value="your friend"/><br/>
    Amount:<input type="text" name="amount" value="$5000"/>
    <input type="hidden" name="_csrf" value="${csrftoken}"/>
      <button type="submit">Transfer Money</button>
    </form>
    </html>
    `)
    console.log('to browser',csrftoken);
})

app.post('/csrf', parseForm, csrfProtection, function (req, res) {
  console.log('from browser:',req.body._csrf)
  res.send("OK")
})

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
            
            userToken = await tokenSchema.create({id: user._id, token: token});
            newUser.token = token;
            done(null, newUser);
          }
        } catch (err) {
          console.log(err);
        }
    }
))

app.get('/loginerror', (req, res) => {
  res.send('error in login')
})

app.get('/', function (req, res) {
    res.status(301).redirect("/auth/google");
})

app.get('/welcome', auth, function (req, res) {
    res.status(200).send('Welcome to my world')
})

app.get('/auth/google',
 passport.authenticate('google', { scope : ['profile', 'email'] })
);

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/error' }),(req,res)=>{
    res.json({
      'email': req.user.email, 'pic': req.user.pic, 'token': req.user.token})
    });

passport.serializeUser(function(user, cb) {
  cb(null, user);
});
 
passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.post('/api/user/register', userController.register);

app.post("/api/user/login", userController.login);

app.use(auth);

app.get("/api/user/all", userController.getAll);

app.post("/api/user/logout", userController.logout);

app.put("/api/user/update", userController.update);

app.delete("/api/user/remove", userController.remove);

app.post("/api/user/uploadavtar", s3FileUpload)

app.post('/api/product/add', productController.add);

app.put("/api/product/update", productController.update);

app.delete("/api/product/remove", productController.remove);

app.post("/api/product/uploadpic", s3ProductPicUpload)

app.get("/api/product/all", productController.getAll);

module.exports = app;