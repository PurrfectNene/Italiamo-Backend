const express = require ('express')
const router = express.Router()
const mongoose = require('mongoose')

const Region= require('../models/Region.model')
const City = require("../models/City.model");
const Place = require("../models/Place.model")
const User = require("../models/User.model")

const fileUploader = require("../config/cloudinary.config");


router.get("/regions", (req, res, next) =>{

    Region.find()
    .then((allRegions)=> res.json(allRegions))
    .catch((err)=> next(err))

})

router.get("/regions/:regionId", (req,res,next)=>{

    const {regionId} = req.params

    if (!mongoose.Types.ObjectId.isValid(regionId)) {
        res.status(400).json({ message: "Specified region id is not valid" });
        return;
      }

    Region.findById(regionId)
    .then((region)=>res.json(region))
    .catch((err)=> next(err))

})

router.put("/regions/:regionId", (req, res, next) => {
  const { regionId } = req.params;
  const update = ({ name, description, imageUrl } = req.body);

  if (!mongoose.Types.ObjectId.isValid(regionId)) {
    res.status(400).json({ message: "Specified region id is not valid" });
    return;
  }

  Region.findByIdAndUpdate(regionId, update, { new: true })
    .then((region) => res.json(region))
    .catch((err) => next(err));
});

router.delete("/regions/:regionId", (req, res, next) => {
  const { regionId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(regionId)) {
    res.status(400).json({ message: "Specified region id is not valid" });
    return;
  }

  Region.findByIdAndDelete(regionId)
    .then((result) => res.json(result))
    .catch((err) => next(err));
});

router.post("/regions", (req, res, next) => {
  const newRegion = ({ name, description, imageUrl } = req.body);

  Region.create(newRegion)
    .then((region) => res.json(region))
    .catch((err) => next(err));
});


router.get("/regions/:regionId/cities", (req, res, next) => {
    const { regionId } = req.params;
    console.log(regionId)
  
    if (!mongoose.Types.ObjectId.isValid(regionId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }
  
    Region.findById(regionId)
      .then((region) => {
        console.log(region)
        City.find({
          region: region._id,
        })
          .then((city) => {
            console.log(city)
            res.json(city);
          })
          .catch((err) => next(err));
      })
      .catch((err) => next(err));
  });


  router.get("/regions/:regionId/places", (req, res, next) => {
    const { regionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(regionId)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
    }

    Region.findById(regionId)
        .then((region) => {
            if (!region) {
                res.status(404).json({ message: "Region not found" });
                return;
            }

            City.find({ region: region._id })
                .then((cities) => {
                    const cityIds = cities.map(city => city._id);
                  
            
                    Place.find({ city: { $in: cityIds } })
                        .then((places) => {
                            res.json(places);
                        })
                        .catch((err) => next(err));
                })
                .catch((err) => next(err));
        })
        .catch((err) => next(err));
});


router.post("/regions-upload", fileUploader.single("imgUrl"), (req, res, next) => {
   
  if (!req.file) {
      next(new Error("No file uploaded!"));
      return;
  }

  res.json({imgUrl: req.file.path}); 
})

router.post('/regions/:regionId/favorites', (req, res) => {
  const { regionId } = req.params;
  const { userId } = req.body;

  User.findByIdAndUpdate(userId,{$push:{favoritesRegions:regionId}},{new:true})
  .then((user)=>{
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Region added to favorites successfully' });
  })
  .catch(err=>{
    res.status(500).json(err)
  })
});


router.delete('/regions/:regionId/favorites/:userId', (req,res) => {
  const { regionId, userId } = req.params;

  User.findByIdAndUpdate(userId, { $pull: { favoritesRegions: regionId } }, { new: true })
      .then(user => {
          if (!user) {
              return res.status(404).json({ error: 'User not found' });
          }
          res.json({ message: 'Region removed from favorites successfully' });
      })
      .catch(err => {
          console.error(err);
          res.status(500).json({ error: 'Server Error' });
      });
})

module.exports = router