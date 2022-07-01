require("dotenv").config()
const express = require('express')
const passport = require('passport')
const session = require('express-session')
const db = require('../config/database').connect()
const User = require('../model/user')
const jwt = require("jsonwebtoken")
const auth = require('../middleware/auth')
const { s3FileUpload, s3ProductPicUpload, s3ProductPicsUpload } = require('../controller/s3')
const userController = require('../controller/user.controller');
const productController = require('../controller/product.controller')
const tokenSchema = require('../model/token')

const app = express();

app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}))

app.use(passport.initialize());
app.use(passport.session());

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

app.post('/api/user', userController.register);

app.post("/api/user/login", userController.login);

app.use(auth);

app.get("/api/user", userController.getUser);

app.get("/api/users", userController.getAllUsers);

app.post("/api/user/logout", userController.logout);

app.put("/api/user", userController.update);

app.delete("/api/user", userController.remove);

app.post("/api/user/uploadavtar", s3FileUpload);

app.post('/api/product', productController.add);

app.put("/api/product", productController.update);

app.delete("/api/product", productController.remove);

app.post("/api/product/uploadpic", s3ProductPicUpload);

app.post("/api/product/uploadpics", s3ProductPicsUpload);

app.get("/api/product", productController.getProductById);

app.get("/api/products", productController.getAllProducts);

module.exports = app;