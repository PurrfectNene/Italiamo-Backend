const router = require("express").Router();
const fileUploader = require("../config/cloudinary.config");
const User = require("../models/User.model");
const Region = require("../models/Region.model")
const City = require("../models/City.model")
const Place = require("../models/Place.model")
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


router.post('/profile/image',(req,res)=>{
  User.findByIdAndUpdate(req.body._id,{imageUrl:req.body.imageUrl},{new:true})
  .then((updatedUser)=>{
    res.json(updatedUser)
  })
  .catch(err=>{
    res.json(err)
  })
})

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
    .populate("favoritesRegions favoritesCities favoritesPlaces")
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.json(err);
    });
})

router.get('/users/:userId/favoritesRegions', (req, res) => {
  User.findById(req.params.userId)
      .then(user => {
        console.log(user)
          if (!user) {
              return res.status(404).json({ error: 'User not found' });
          }
          res.json(user.favoritesRegions)
         
      })
      .catch(err => {
          console.error(err);
          res.status(500).json({ error: 'Server Error' });
      });
});

router.get('/users/:userId/favoritesCities', (req, res) => {
  User.findById(req.params.userId)
      .then(user => {
          if (!user) {
              return res.status(404).json({ error: 'User not found' });
          }
          res.json(user.favoritesCities);
      })
      .catch(err => {
          console.error(err);
          res.status(500).json({ error: 'Server Error' });
      });
});

router.get('/users/:userId/favoritesPlaces', (req, res) => {
  User.findById(req.params.userId)
      .then(user => {
          if (!user) {
              return res.status(404).json({ error: 'User not found' });
          }
          res.json(user.favoritesPlaces);
      })
      .catch(err => {
          console.error(err);
          res.status(500).json({ error: 'Server Error' });
      });
});

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