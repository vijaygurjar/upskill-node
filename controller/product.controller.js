const bcrypt = require("bcryptjs");
const Product = require('../model/product');
const jwt = require("jsonwebtoken");
const productValidator = require('./product.validator')
const Joi = require('joi');
const mongoose = require('mongoose');

exports.addProduct = async (req, res) => {
  try {
    const { title, type, description, filename, price, rating } = req.body;
    const validateResult = productValidator.validate(req.body);
    if (validateResult.error) {
      throw validateResult.error.message;
    } else {
      const product = await Product.create({
        title: title,
        type: type,
        description: description,
        filename: filename,
        price: price,
        rating: rating
      })
      res.status(200).json(product);
    }
  } catch (err) {
    res.status(400).send(err);
  }
}
exports.update = async (req, res) => {
  try {
    const { title, type, description, filename, price, rating } = req.body;
    const { _id } = req.query
    const validateResult = productValidator.validate(req.body);
    if (validateResult.error) {
      throw validateResult.error.message;
    } else {
      var query = { '_id': mongoose.Types.ObjectId(_id) };
      var newData = { firstname: title, type: type, description: description, filename: filename, price: price, rating:rating };

      Product.findOneAndUpdate(query, { $set: newData }, { new: true }, function (err, doc) {
        if (err) return res.send(500, { error: err });
        return res.send('Product updated.');
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
}

exports.remove = async (req, res) => {
  try {
    const { _id } = req.body;
    var validateResult = productValidator.validate(req.body);

    if (validateResult.error) {
      throw validateResult.error;
    } else {
      Product.deleteOne({ _id: _id }, function (err) {
        if (!err) {
          return res.send('Product deleted!!');
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
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).send(error);
  }
}

exports.uploadProductPic = async (req, res) => {
  try {
    const { name, _id, url } = req;
    var query = { '_id': mongoose.Types.ObjectId(_id) };
    var newData = { filename: name };
    Product.findOneAndUpdate(query, { $set: newData }, { new: true }, function (err, doc) {
      if (err) throw err;
      else return res.status(200).send({ "message": 'success', file: 'name', url: url });
    });
  } catch (error) {
    res.status(400).send(error);
  }
}

exports.uploadProductAssets = async (req, res) => {
  try {
    const { images, _id } = req;
    var query = { '_id': mongoose.Types.ObjectId(_id) };
    var newData = { assets: images };
    Product.findOneAndUpdate(query, { $set: newData }, { new: true }, function (err, doc) {
      if (err) throw err;
      else return res.status(200).send({ "message": 'success', images: images });
    });
  } catch (error) {
    res.status(400).send(error);
  }
}