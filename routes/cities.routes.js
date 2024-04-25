const express = require ('express')
const router = express.Router()
const mongoose = require('mongoose')

const City = require("../models/City.model");
const Place = require("../models/Place.model")
const Region = require("../models/Region.model")

const fileUploader = require("../config/cloudinary.config");


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
    .populate("city")
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


// CREATING A POST AND PUT REQUEST TO TEST

router.post("/cities", fileUploader.single("imgUrl"), (req, res, next) => {
    const { region, name, description } = req.body
    const imgUrl = req.file.path

    Region.findOne({ name: region })
        .then(existingRegion => {
            if (!existingRegion) {
                return res.status(404).json({ message: "Region not found" })
            }

            const newCity = new City({
                region: existingRegion._id,
                name,
                description,
                imgUrl
            });

            return newCity.save()
        })
        .then(savedCity => {
            res.status(201).json(savedCity)
        })
        .catch(error => {
            res.status(400).json({ message: error.message })
        })
})


router.post("/cities-upload", fileUploader.single("imgUrl"), (req, res, next) => {
   
    if (!req.file) {
        next(new Error("No file uploaded!"));
        return;
    }

    res.json({imgUrl: req.file.path}); //"imgUrl" is the ref for front-end
})



router.put("/cities/:cityId", (req, res, next) => {
    const { cityId } = req.params
    const { region, name, description } = req.body

    if (!mongoose.Types.ObjectId.isValid(cityId)) {
        return res.status(400).json({ message: "Invalid city ID" })
    }

    City.findById(cityId)
        .then(existingCity => {
            if (!existingCity) {
                return res.status(404).json({ message: "City not found" })
            }

            if (region) {
                existingCity.region = region
            }
            if (name) {
                existingCity.name = name
            }
            if (description) {
                existingCity.description = description
            }

            return existingCity.save()
        })
        .then(updatedCity => {
            res.json(updatedCity)
        })
        .catch(error => {
            next(error)
        })
})


router.delete("/cities/:cityId", (req, res, next) => {
    const { cityId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cityId)) {
        return res.status(400).json({ message: "Invalid city ID" });
    }

    console.log(cityId)


    City.findByIdAndDelete(cityId)
        .then(deletedCity => {
            if (!deletedCity) {
                return res.status(404).json({ message: "City not found" });
            }
            res.json({ message: "City deleted successfully", deletedCity });
        })
        .catch(error => {
            next(error);
        });
});





module.exports = router

    
