const router = require("express").Router();
const fileUploader = require("../config/cloudinary.config");
const User = require("../models/User.model");
const {
  isAuthenticated,
  getTokenFromHeaders,
} = require("../middleware/jwt.middleware");
const jwt = require("jsonwebtoken");

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.post("/upload", fileUploader.single("imageUrl"), (req, res, next) => {
  // console.log("file is: ", req.file)
  if (!req.file) {
    console.log("NO FILE");
    next(new Error("No file uploaded!"));
    return;
  }
  console.log(req.file);
  // Get the URL of the uploaded file and send it as a response.
  res.json({ fileUrl: req.file.path });
});

router.post("/profile/image", isAuthenticated, (req, res, next) => {
  let token = getTokenFromHeaders(req);
  let payload;

  try {
    payload = jwt.verify(token, process.env.TOKEN_SECRET);
  } catch (err) {
    return next(err.message);
  }

  User.findByIdAndUpdate(
    payload._id,
    { imageUrl: req.body.imageUrl },
    { new: true }
  )
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get('/user/:id',(req,res)=>{
  User.findById(req.params.id)
  .then((user)=>{
    res.json(user)
  })
  .catch(err=>{
    res.json(err)
  })
})

module.exports = router;

// /**
//  * 
//  * req: {
//  * header: {}
//  * body: {}
//  * }
//  */

// req.file.path

// req.file = undefined;

// req.file.path => undefined.path