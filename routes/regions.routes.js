const express = require ('express')
const router = express.Router()
const mongoose = require('mongoose')

const Region= require('../models/Region.model')
const City = require("../models/City.model");
const Place = require("../models/Place.model")

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
  
module.exports = router