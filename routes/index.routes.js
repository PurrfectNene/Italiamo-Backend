const router = require("express").Router();
const fileUploader = require("../config/cloudinary.config");
const User = require("../models/User.model");

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.post("/upload", fileUploader.single("imageUrl"), (req, res, next) => {
  // console.log("file is: ", req.file)
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  console.log(req.file)
  // Get the URL of the uploaded file and send it as a response. 
  res.json({ fileUrl: req.file.path })
});


router.post('/profile/image',(req,res)=>{
  User.findByIdAndUpdate(req.body._id,{imageUrl:req.body.imageUrl},{new:true})
  .then((updatedUser)=>{
    res.json(updatedUser)
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