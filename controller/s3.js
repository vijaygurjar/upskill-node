const S3 = require('aws-sdk/clients/s3');
const fs = require("fs");
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
    const {_id} = req.query;
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
            const resData = {
                _id: _id, url: req.file.location, name: req.file.key, type: req.file.mimetype, size: req.file.size
            }
            userController.uploadAvtar(resData, res)
        }
    })
}

exports.s3ProductPicUpload = async (req, res) => {
  const {_id} = req.query;
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
          const resData = {
              _id: _id, url: req.file.location, name: req.file.key, type: req.file.mimetype, size: req.file.size
          }
          productController.uploadProductPic(resData, res)
      }
  })
}

exports.s3ProductPicsUpload = async (req, res) => {
  const {_id} = req.query;
  const uploadProductPicsS3 = multer({
      storage: multers3({
          s3: s3,
          bucket: bucket,
          ACL: 'public-read',
          key: function (req, file, cb) {
              cb(null, file.originalname); //use Date.now() for unique file keys
          }
      })
  }).array('files')
  uploadProductPicsS3(req , res, (err)=> {
      if (err) {
          res.send("Error in file uploading");
      } else {
        let fileArray = req.files;
        const resData = {_id: _id};
        const images = [];
        for (let i = 0; i < fileArray.length; i++) {
          images.push({name: fileArray[i].key, type: fileArray[i].mimetype})
        }
        resData.images = images;
        // Save the file name into database
        
        productController.uploadProductPics(resData, res)
        // return res.status(200).json({
        //     status: 'ok',
        //     filesArray: fileArray,
        //     locationArray: images
        //   });

        //   const resData = {
        //       _id: _id, url: req.file.location, name: req.file.key, type: req.file.mimetype, size: req.file.size
        //   }
        //   productController.uploadProductPic(resData, res)
      }
  })
}