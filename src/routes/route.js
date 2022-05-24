const express = require('express');
const router = express.Router();
const aws= require("aws-sdk");

const userController= require("../controllers/userController")
const BookController= require("../controllers/bookController")
const ReviewController= require("../controllers/reviewController")
const Middleware = require("../Middleware/Authentication")


//------------------------------USER API -----------------------------------***

router.post("/register",userController.Createuser)

router.post('/login', userController.login)

// ---------------------------BOOK API -------------------------------------***

router.post('/books' ,BookController.Bookcreate)

router.get('/books',Middleware.Mid1,BookController.GetBook)

router.get('/books/:bookId',Middleware.Mid1,BookController.resultBook)

router.put("/books/:bookId",Middleware.Mid1,Middleware.Mid2,BookController.UpdateBook)

router.delete("/books/:bookId",Middleware.Mid1,Middleware.Mid2,BookController.DeleteBook)

//-----------------------------REVIEW API ----------------------------------***

router.post('/books/:bookId/review',ReviewController.CreateReview)

router.put('/books/:bookId/review/:reviewId',ReviewController.ReviewUpdate)

router.delete('/books/:bookId/review/:reviewId',ReviewController.ReviewDelete)

//-----------------------------------------------------------------------------

aws.config.update({
    accessKeyId: "AKIAY3L35MCRUJ6WPO6J",
    secretAccessKey: "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",
    region: "ap-south-1"
});
let uploadFile = async (file) => {
    return new Promise(function (resolve, reject) {
        let s3 = new aws.S3({ apiVersion: '2006-03-01' });
        var uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket",
            Key: "abc/" + file.originalname,
            Body: file.buffer
        }
        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ "error": err })
            }
            console.log(data)
            console.log("file uploaded succesfully")
            return resolve(data.Location)
        })
    })
}
router.post("/write-file-aws", async function (req, res) {
    try {
        let files = req.files
        if (files && files.length > 0) {
            let uploadedFileURL = await uploadFile(files[0])
            res.status(201).send({ msg: "file uploaded succesfully", data: uploadedFileURL })
        }
        else {
            res.status(400).send({ msg: "No file found" })
        }
    }
    catch (err) {
        res.status(500).send({ msg: err })
    }
});


module.exports = router;

//,Middleware.Mid1,