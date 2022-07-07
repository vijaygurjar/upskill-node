const bcrypt = require("bcryptjs")
const User = require('../model/user')
const tokenSchema = require('../model/token')
const jwt = require("jsonwebtoken")
const { userValidator, loginValidator, logoutValidator, userUpdateValidator } = require('../validator/user.validator')

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
        throw { message: "User already registerd!" };
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
          { email: email }, process.env.TOKEN_KEY, { expiresIn: "2h" }
        );

        user.token = token;
        await tokenSchema.create({
          _id: user._id,
          token: token
        })

        let resField = {'_id': user._id, 'firstname': user.firstname, 'lastname': user.lastname, 'email': user.email, 'gender': user.gender, 'status': user.status, 'pic': user.pic, 'googleid': user.googleid, 'token': token}

        res.status(200).json(resField);

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
        }, function (err, response) {
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
          { email: email }, process.env.TOKEN_KEY, { expiresIn: "2h" }
        );
        user.token = token;

        var query = { '_id': user._id };
        var newData = { token: token };

        await tokenSchema.findOneAndUpdate(query, { $set: newData }, { upsert: true });
        let resField = {'_id': user._id, 'firstname': user.firstname, 'lastname': user.lastname, 'email': user.email, 'gender': user.gender, 'status': user.status, 'pic': user.pic, 'googleid': user.googleid, 'token': token}

        res.status(200).json(resField);
      } else {
        throw { message: "email or password missmatch" };
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
      throw { message: "User id required!" };
    }
    const validateResult = logoutValidator.validate({ _id });
    if (validateResult.error) {
      throw validateResult.error;
    } else {
      tokenSchema.deleteOne({ _id: _id }, function (err) {
        if (!err) {
          res.status(200).send({ "message": "success" });
        } else {
          throw err;
        }
      });
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
}

exports.googleLogout = (req, res) => {
  req.session.destroy(function (err) {
    req.logOut(function (err) {
      req.user = null;
      res.clearCookie('connect.sid');
      res.redirect('https://mail.google.com/mail/u/0/?logout&hl=en');

    })
  });
}
exports.update = async (req, res) => {
  try {
    const { firstname, lastname, gender, status } = req.body;
    const _id = req.body._id || req.query._id || req.headers["_id"];
    if (_id === undefined) {
      throw { message: "User id required!" };
    }
    const validateResult = userUpdateValidator.validate({ firstname, lastname, gender, status });
    if (validateResult.error) {
      throw validateResult.error.message;
    } else {
      var query = { '_id': _id };
      var newData = { firstname: firstname, lastname: lastname, gender: gender, status: status };

      await User.findOneAndUpdate(query, { $set: newData }, { new: true })
      res.status(200).json({ "message": "success" });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
}

exports.remove = async (req, res) => {
  try {
    const _id = req.body._id || req.query._id || req.headers["_id"];
    if (_id === undefined) {
      throw { message: "User id required!" };
    }
    await User.deleteOne({ _id: _id });
    await tokenSchema.deleteOne({ _id: _id });
    res.status(200).json({ 'message': 'success' });
  } catch (error) {
    console.log('remove:', error)
    res.status(400).send(error.message);
  }
}

exports.getUser = async (req, res) => {
  try {
    const _id = req.body._id || req.query._id || req.headers["_id"];
    let result;
    let resField = {'firstname': true, 'lastname': true, 'email': true, 'gender': true, 'status': true, 'pic': true, 'googleid': true}
    if (_id === undefined || String(_id).trim().length === 0) {
      result = await User.find({}, resField);
    } else {
      result = await User.findOne({ _id }, resField);
    }
    res.status(200).json(result);
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
