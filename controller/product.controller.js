const Product = require('../model/product');
const productValidator = require('../validator/product.validator');

exports.add = async (req, res) => {
  try {
    const { title, type, description, pic, price, rating, stock, status } = req.body;
    const validateResult = productValidator.validate(req.body);
    
    if (validateResult.error) {
      throw validateResult.error;
    } else {
        const product = await Product.create({
          title: title,
          type: type,
          description: description,
          pic: pic,
          price: price,
          rating: rating,
          stock: stock,
          status: status
        })
        res.status(200).json({product: product});
    }
  } catch (err) {
    res.status(400).send(err);
  }
}

exports.update = async (req, res) => {
  try {
    const { title, type, description, price, rating, stock, status } = req.body;
    const _id = req.body._id || req.query._id || req.headers["_id"];
    if (_id === undefined) {
      throw {message: "Product id required!"};
    }
    const validateResult = productValidator.validate({ title, type, description, price, rating, stock, status });
    if (validateResult.error) {
      throw validateResult.error.message;
    } else {
      var query = { '_id': _id };
      var newData = { title: title, type: type, description: description, price: price, rating: rating, stock: stock, status: status };
      
      await Product.findOneAndUpdate(query, { $set: newData }, { new: true });
      
      res.status(200).json({'message': 'success'});
    }
  } catch (error) {
    console.log(error)
    res.send(error);
  }
}

exports.remove = async (req, res) => {
  try {
    const _id = req.body._id || req.query._id || req.headers["_id"];
    if (_id === undefined) {
      throw {message: "Product id required!"};
    }
    await Product.deleteOne({ _id: _id });
    res.status(200).json({'message': 'success'});
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
    var query = { '_id': _id };
    var newData = { pic: name };
    await Product.findOneAndUpdate(query, { $set: newData }, { new: true });
    res.status(200).send({ "message": 'success', file: name, url: url });
  } catch (error) {
    res.status(400).send(error);
  }
}

exports.uploadProductPics = async (req, res) => {
  try {
    const { _id, images } = req;
    var query = { '_id': _id };
    var newData = { images: images };
    const productUpdate = await Product.findOneAndUpdate(query, { $set: newData }, { new: true });
    res.status(200).send({ "message": 'success', 'images': images });
  } catch (error) {
    res.status(400).send(error);
  }
}
