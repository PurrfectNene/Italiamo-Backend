const express = require ('express')
const router = express.Router()
const mongoose = require('mongoose')

const City = require("../models/City.model");
const Place = require("../models/Place.model")
const Region = require("../models/Region.model")
const User = require("../models/User.model")


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
      .populate("city reviews")
      .then((allPlaces) => res.json(allPlaces))
      .catch((err) => next(err));

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

router.post("/cities", (req, res, next) => {
  const { region, name, description, imageUrl } = req.body;

  Region.findOne({ _id: region })
    .then((existingRegion) => {
      if (!existingRegion) {
        throw new Error("Region not found");
      }

      const newCity = new City({
        region: existingRegion._id,
        name,
        description,
        imageUrl,
      });

      return newCity.save();
    })
    .then((savedCity) => {
      res.status(201).json(savedCity);
    })
    .catch((error) => {
      next(error);
    });
});

router.post(
  "/cities-upload",
  fileUploader.single("imgUrl"),
  (req, res, next) => {
    if (!req.file) {
      next(new Error("No file uploaded!"));
      return;
    }

    res.json({ imgUrl: req.file.path }); //"imgUrl" is the ref for front-end
  }
);

router.put("/cities/:cityId", (req, res, next) => {
  const { cityId } = req.params;
  const { region, name, description, imageUrl } = req.body;

  if (!mongoose.Types.ObjectId.isValid(cityId)) {
    return res.status(400).json({ message: "Invalid city ID" });
  }
  
  City.findById(cityId)
    .then((existingCity) => {
      if (!existingCity) {
        throw new Error("City not found");
      }

      if (region) {
        existingCity.region = region;
      }
      if (name) {
        existingCity.name = name;
      }
      if (description) {
        existingCity.description = description;
      }
      if (imageUrl) {
        existingCity.imageUrl = imageUrl;
      }

      return existingCity.save();
    })
    .then((updatedCity) => {
      res.json(updatedCity);
    })
    .catch((error) => {
      next(error);
    });
});


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


router.post('/cities/:cityId/favorites', (req, res) => {
  const { cityId } = req.params;
  const { userId } = req.body;

  User.findByIdAndUpdate(userId,{$push:{favoritesCities: cityId}},{new:true})
  .then((user)=>{
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'City added to favorites successfully' });
  })
  .catch(err=>{
    res.status(500).json(err)
  })
});

router.delete('/cities/:cityId/favorites/:userId', (req, res) => {
  const { cityId, userId } = req.params;

  User.findByIdAndUpdate(userId, { $pull: { favoritesCities: cityId } }, { new: true })
      .then(user => {
          if (!user) {
              return res.status(404).json({ error: 'User not found' });
          }
          res.json({ message: 'City removed from favorites successfully' });
      })
      .catch(err => {
          console.error(err);
          res.status(500).json({ error: 'Server Error' });
      });
});



module.exports = router

    
