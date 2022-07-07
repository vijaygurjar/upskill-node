const express = require('express');

const auth = require('../middleware/auth');
const { s3ProductPicUpload, s3ProductPicsUpload } = require('../controller/s3');
const productController = require('../controller/product.controller');

const productRoutes = express.Router();

productRoutes.use(auth);

productRoutes.post('/', productController.add);

productRoutes.put('/', productController.update);

productRoutes.delete('/', productController.remove);

productRoutes.post('/uploadpic', s3ProductPicUpload);

productRoutes.post('/uploadpics', s3ProductPicsUpload);

productRoutes.get('/', productController.getProduct);

module.exports = productRoutes