require("dotenv").config();
const express = require('express');
const db = require('./config/database').connect();
const User = require('./model/user');
const bcrypt = require("bcryptjs");
const bodyParser = require('body-parser')
const jwt = require("jsonwebtoken");
const app = express();
const auth = require('./middleware/auth');
const { s3FileUpload } = require('./middleware/s3');
const userController = require('./controller/userController');

app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use(express.json({ limit: "50mb" }));

app.get('/', function (req, res) {
    console.log('call home page');
})

app.get('/welcome', auth, function (req, res) {
    res.status(200).send('Welcome to my world')
})

app.post('/api/user/register', userController.register);

/**
 * @description Login Route
 * @method Post
 */
app.post("/api/user/login", userController.login);

app.get("/api/user/allUsers", userController.getAll);

app.post("/api/user/update", auth, userController.update);

app.put("/api/user/update", auth, userController.update);

app.delete("/api/user/remove", auth, userController.remove);

app.post("/api/user/uploadavtar", s3FileUpload)

module.exports = app;