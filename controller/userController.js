const bcrypt = require("bcryptjs");
const User = require('../model/user');
const jwt = require("jsonwebtoken");
const userValidator = require('./user.validator')
const Joi = require('joi');
const mongoose = require('mongoose');
const nodemailer = require("nodemailer");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const schema = Joi.object({
      username: Joi.string().min(3).max(25).required(),
      password: Joi.string().min(4).required()
    })
    const validation_result = schema.validate({ username, password });
    if (validation_result.error) {
      throw validation_result.error;
    } else {
      // check user exist in our database
      const user = await User.findOne({ username });
      if (user && (await bcrypt.compare(password, user.password))) {
        // token  creation
        const token = jwt.sign(
          { user_id: user._id, username },
          process.env.TOKEN_KEY,
          {
            expiresIn: "365d",
          }
        );

        res.status(200).json({ username: user.username, email: user.email, gender: user.gender, pic: user.pic, token: token });
      } else {
        throw "Username or password missmatch";
      }
    }
  } catch (err) {
    res.status(400).send(err);
  }
}

exports.register = async (req, res) => {
  try {
    const { firstname, lastname, username, email, password, gender, status } = req.body;
    const validateResult = userValidator.validate(req.body);
    if (validateResult.error) {
      throw validateResult.error.message;
    } else {
      const oldUser = await User.findOne({ username: username, email:email });
      if (oldUser) {
        throw "User already registerd";
      } else {
        const encryptedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
          firstname: firstname,
          lastname: lastname,
          username: username,
          email: String(email).toLowerCase(),
          password: encryptedPassword,
          gender: gender,
          status: status
        })
  
        const token = jwt.sign(
          { user_id: user._id, username },
          process.env.TOKEN_KEY,
          {
            expiresIn: "365d",
          }
        );
  
        user.token = token;
        let transporter = nodemailer.createTransport({
          service: 'gmail',
          host: 'smtp.gmail.com',
          port: 587,
          secure: true,
          auth: {
            user: process.env.GMAIL_ID,
            pass: process.env.GMAIL_PASSWORD
          }, tls: {
            rejectUnauthorized: false
          }
        });
        
        transporter.sendMail({
          from: process.env.GMAIL_ID,
          to: user.email,
          subject: `${user.username} your registration completed`,
          text: `Hello ${user.username}, Welcome to our nodejs world`,
          html: `<b>Hello ${user.username},</b></n> Welcome to our nodejs world </b>`
        },function(err, response) {
          if (err) {
            console.log(err);
          }
          res.status(200).json(user);
        });
      }
    }
  } catch (err) {
    console.log(err.message)
    res.status(400).send(err.message);
  }
}
exports.update = async (req, res) => {
  try {
    const { firstname, lastname, username, email, gender, status } = req.body;
    const { _id } = req.query
    const validateResult = userValidator.validate(req.body);
    if (validateResult.error) {
      throw validateResult.error.message;
    } else {
      var query = { '_id': mongoose.Types.ObjectId(_id) };
      var newData = { firstname: firstname, lastname: lastname, gender: gender, status: status };

      User.findOneAndUpdate(query, { $set: newData }, { new: true }, function (err, doc) {
        if (err) return res.send(500, { error: err });
        return res.send('Succesfully saved.');
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
}

exports.remove = async (req, res) => {
  try {
    const { username } = req.body;
    var validateResult = userValidator.validate(req.body);

    if (validateResult.error) {
      throw validateResult.error;
    } else {
      User.deleteOne({ username: username }, function (err) {
        if (!err) {
          return res.send('Record deleted!!');
        } else {
          throw err;
        }
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
}

exports.getAll = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).send(error);
  }
}

exports.uploadAvtar = async (req, res) => {
  try {
    const { name, _id, url } = req;
    var query = { '_id': mongoose.Types.ObjectId(_id) };
    var newData = { pic: name };
    User.findOneAndUpdate(query, { $set: newData }, { new: true }, function (err, doc) {
      if (err) throw err;
      else return res.status(200).send({ "message": 'success', file: 'name', url: url });
    });
  } catch (error) {
    res.status(400).send(error);
  }
}