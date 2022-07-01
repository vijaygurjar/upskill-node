const bcrypt = require("bcryptjs")
const User = require('../model/user')
const tokenSchema = require('../model/token')
const jwt = require("jsonwebtoken")
const {userValidator, loginValidator, logoutValidator, userUpdateValidator} = require('../validator/user.validator')

const nodemailer = require("nodemailer")

exports.register = async (req, res) => {
  try {
    const { firstname, lastname, email, password, gender, status } = req.body;
    const validateResult = userValidator.validate({ firstname, lastname, email, password, gender, status });
    
    if (validateResult.error) {
      throw validateResult.error;
    } else {
      const existingUser = await User.findOne({ email: String(email).toLowerCase() });
      if (existingUser) {
        throw {message: "User already registerd!"};
      } else {
        const encryptedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
          firstname: firstname,
          lastname: lastname,
          email: String(email).toLowerCase(),
          password: encryptedPassword,
          gender: gender,
          status: status
        })
  
        const token = jwt.sign(
          { email: email }, process.env.TOKEN_KEY, { expiresIn: "2h"}
        );
  
        user.token = token;
        await tokenSchema.create({
          _id: user._id,
          token: token
        })
        
        res.status(200).json({'_id': user._id, 'token': token});
        
         let transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          secure: true,
          auth: {
            user: process.env.EMAIL_AUTH_USER_EMAIL,
            pass: process.env.EMAIL_AUTH_USER_PASS,
          },
          tls: {
            rejectUnauthorized: false
          }
        });
        
        transporter.sendMail({
          from: process.env.EMAIL_AUTH_USER_EMAIL,
          to: user.email,
          subject: 'Sending Email using Node.js',
          text: `Hello ${user.firstname || user.email}, Welcome to our nodejs world`,
          html: `<b>Hello ${user.firstname || user.email},</b><br> Welcome to our nodejs world </b>`
        },function(err, response) {
          if (err) {
            console.log(err);
          }
        });
      }
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const validateResult = loginValidator.validate(req.body);
    if (validateResult.error) {
      throw validateResult.error;
    } else {
      const user = await User.findOne({ email });
      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
          { email: email }, process.env.TOKEN_KEY, { expiresIn: "2h"}
        );
        user.token = token;

        var query = { '_id': user._id };
        var newData = { token : token};

        await tokenSchema.findOneAndUpdate(query, { $set: newData }, { upsert: true});
        res.status(200).json({ _id: user._id, name: user.firstname + ' ' + user.lastname, email: user.email, gender: user.gender, pic: user.pic, token: token});
      } else {
        throw {message: "email or password missmatch"};
      }
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
}

exports.logout = async (req, res) => {
  try {
    const _id = req.body._id || req.query._id || req.headers["_id"];
    if (_id === undefined) {
      throw {message: "User id required!"};
    }
    const validateResult = logoutValidator.validate(req.body);
    if (validateResult.error) {
      throw validateResult.error;
    } else {
        tokenSchema.deleteOne({ _id: _id }, function (err) {
        if (!err) {
          res.status(200).send({"message": "success"});
        } else {
          throw err;
        }
      });
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
}

exports.update = async (req, res) => {
  try {
    const { firstname, lastname, gender, status } = req.body;
    const _id = req.body._id || req.query._id || req.headers["_id"];
    if (_id === undefined) {
      throw {message: "User id required!"};
    }
    const validateResult = userUpdateValidator.validate({firstname, lastname, gender, status});
    if (validateResult.error) {
      throw validateResult.error.message;
    } else {
      var query = { '_id': _id };
      var newData = { firstname: firstname, lastname: lastname, gender: gender, status: status };

      await User.findOneAndUpdate(query, { $set: newData }, { new: true })
      res.status(200).json({"message": "success"});
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
}

exports.remove = async (req, res) => {
  try {
    const _id = req.body._id || req.query._id || req.headers["_id"];
    if (_id === undefined) {
      throw {message: "User id required!"};
    }
    await User.deleteOne({ _id: _id });
    await tokenSchema.deleteOne({ _id: _id });
    res.status(200).json({'message': 'success'});
  } catch (error) {
    console.log('remove:' ,error)
    res.status(400).send(error.message);
  }
}

exports.getUser = async (req, res) => {
  try {
    const _id = req.body._id || req.query._id || req.headers["_id"];
    if (_id === undefined || String(_id).trim().length === 0) {
      throw {message: "User id required!"};
    }
    const user = await User.findOne({ _id });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

exports.uploadAvtar = async (req, res) => {
  try {
    const { name, _id, url } = req;
    var query = { '_id': _id };
    var newData = { pic: name };
    await User.findOneAndUpdate(query, { $set: newData }, { new: true })
    res.status(200).send({ "message": 'success', file: name, url: url });
  } catch (error) {
    res.status(400).send(error.message);
  }
}
