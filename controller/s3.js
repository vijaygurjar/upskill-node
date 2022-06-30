const S3 = require('aws-sdk/clients/s3');
const multer = require("multer");
const multers3 = require("multer-s3");
const userController = require('./user.controller');
const productController = require('./product.controller');

const bucket = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKey = process.env.AWS_ACCESS_KEY
const secretKey = process.env.AWS_SECRET_KEY
  
const s3 = new S3({
    region,
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey
    }
})

exports.s3FileUpload = async (req, res) => {
    const _id = req.body._id || req.query._id || req.headers["_id"];
    const uploadS3Test = multer({
        storage: multers3({
            s3: s3,
            bucket: bucket,
            acl: 'public-read',
            key: function (req, file, cb) {
                cb(null, file.originalname); //use Date.now() for unique file keys
            }
        })
    }).single('files')
    uploadS3Test(req , res, (err)=> {
        if (err) {
            res.send("Error in file uploading");
        } else {
          if (req.file === undefined) {
            res.status(400).send({'message': 'error in file uploading'}); 
          } else {
            const resData = {
                _id: _id, url: req.file.location, name: req.file.key, type: req.file.mimetype, size: req.file.size
            }
            userController.uploadAvtar(resData, res)
          }
        }
    })
}

exports.s3ProductPicUpload = async (req, res) => {
  const _id = req.body._id || req.query._id || req.headers["_id"];
  const uploadProductPicS3 = multer({
      storage: multers3({
          s3: s3,
          bucket: bucket,
          ACL: 'public-read',
          key: function (req, file, cb) {
              cb(null, file.originalname); //use Date.now() for unique file keys
          }
      })
  }).single('files')
  uploadProductPicS3(req , res, (err)=> {
      if (err) {
          res.send("Error in file uploading");
      } else {
        if (req.file === undefined) {
          res.status(400).send({'message': 'error in file uploading'}); 
        } else {
          const resData = {
              _id: _id, url: req.file.location, name: req.file.key, type: req.file.mimetype, size: req.file.size
          }
          productController.uploadProductPic(resData, res)
        }
      }
  })
}

exports.s3ProductPicsUpload = async (req, res) => {
  const _id = req.body._id || req.query._id || req.headers["_id"];
  const uploadProductPicsS3 = multer({
      storage: multers3({
          s3: s3,
          bucket: bucket,
          ACL: 'public-read',
          key: function (req, file, cb) {
              cb(null, file.originalname);
          }
      })
  }).array('files')
  uploadProductPicsS3(req , res, (err)=> {
      if (err) {
          res.send("Error in file uploading");
      } else {
        if (req.files === undefined) {
          res.status(400).send({'message': 'error in file uploading'}); 
        } else {
          let fileArray = req.files;
          const resData = {_id: _id};
          const images = [];
          for (let i = 0; i < fileArray.length; i++) {
            images.push({name: fileArray[i].key, type: fileArray[i].mimetype})
          }
          resData.images = images;
          
          productController.uploadProductPics(resData, res)
        }
        
      }
  })
}