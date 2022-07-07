const express = require('express')

const auth = require('../middleware/auth')
const { s3FileUpload } = require('../controller/s3')
const userController = require('../controller/user.controller')

const userRoutes = express.Router();

userRoutes.post('/', userController.register);

userRoutes.use(auth);

userRoutes.get("/", userController.getUser);

userRoutes.put("/", userController.update);

userRoutes.delete("/", userController.remove);

userRoutes.post("/uploadavtar", s3FileUpload);

module.exports = userRoutes;