const express = require ('express')
const router = express.Router()
const mongoose = require('mongoose')

const City = require("../models/City.model");
const Place = require("../models/Place.model")
const Region = require("../models/Region.model")


router.get("/cities", (req,res,next)=>{  

    City.find()
    .populate("region")
    .then((allCities)=>res.json(allCities))
    .catch((err)=> next(err))

})

router.get("/cities/:cityId", (req,res,next)=>{ 

    const {cityId} = req.params

    if (!mongoose.Types.ObjectId.isValid(cityId)) {
        res.status(400).json({ message: "Specified city id is not valid" });
        return;
      }

    City.findById(cityId)
    .populate("region")
    .then((city)=>res.json(city))
    .catch((err)=> next(err))

})

// Getting all places for one city rather then getting all places regardless of the city - it makes sense for the UX
// Check relation between axios calls and backend - /places or: 

router.get("/cities/:cityId/places",(req,res,next)=>{

    const { cityId } = req.params

    Place.find({ city: cityId })
    .then((allPlaces)=>res.json(allPlaces))
    .catch((err)=> next(err))

})

router.get("/cities/:cityId/places/:placeId",(req,res,next)=>{
    
    const {placeId} = req.params

    if (!mongoose.Types.ObjectId.isValid(placeId)) {
        res.status(400).json({ message: "Specified place id is not valid" })
        return;
      }

    Place.findById(placeId)
    .then((place)=>res.json(place))
    .catch((err)=> next(err))
})


// CREATING A POST REQUEST TO TEST

router.post("/cities", (req, res, next) => {
    const { region, name, description } = req.body

    Region.findOne({ name: region })
        .then(existingRegion => {
            if (!existingRegion) {
                return res.status(404).json({ message: "Region not found" })
            }

            const newCity = new City({
                region: existingRegion._id,
                name,
                description
            });

            return newCity.save()
        })
        .then(savedCity => {
            res.status(201).json(savedCity)
        })
        .catch(error => {
            res.status(400).json({ message: error.message })
        });
});





module.exports = router

    
