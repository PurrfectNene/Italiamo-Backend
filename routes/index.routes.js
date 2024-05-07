const router = require("express").Router();
const fileUploader = require("../config/cloudinary.config");
const User = require("../models/User.model");

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
  console.log(req.file)
  // Get the URL of the uploaded file and send it as a response. 
  res.json({ fileUrl: req.file.path })
});


router.post('/profile/image',(req,res)=>{
  console.log(req.body);
  console.log("HOW?", req.body.imageUrl);
  User.findByIdAndUpdate(req.body._id,{imageUrl:req.body.imageUrl},{new:true})
  .then((updatedUser)=>{
    res.json(updatedUser)
  })
  .catch(err=>{
    res.json(err)
  })
})

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