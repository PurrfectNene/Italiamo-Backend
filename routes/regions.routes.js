const express = require ('express')
const router = express.Router()
const mongoose = require('mongoose')

const Region= require('../models/Region.model')

router.get("/regions", (req, res, next) =>{

    Region.find()
    .then((allRegions)=> res.json(allRegions))
    .catch((err)=> next(err))

})

router.get("/regions/:regionId", (req,res,next)=>{

    const {regionId} = req.params

    if (!mongoose.Types.ObjectId.isValid(regionId)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
      }

    Region.findById(regionId)
    .then((region)=>res.json(region))
    .catch((err)=> next(err))

})


router.get("/regions/:regionId/cities", (req, res, next) => {
    const { regionId } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(regionId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }
  
    Region.findById(regionId)
      .then((region) => {
        City.find({
          region: region._id,
        })
          .then((city) => {
            res.json(city);
          })
          .catch((err) => next(err));
      })
      .catch((err) => next(err));
  });

module.exports = router