const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Place = require("../models/Place.model")
const City = require("../models/City.model")
const Review = require("../models/Review.model");

const fileUploader = require("../config/cloudinary.config");
const { isAuthenticated,getTokenFromHeaders } = require('../middleware/jwt.middleware')
const jwt = require("jsonwebtoken")

router.get("/places", (req, res, next) => {
    Place.find()
        .populate('city')
        .then(places => {
            res.json(places);
        })
        .catch(error => {
            next(error);
        });
});




router.post("/places", fileUploader.single("imgUrl"), (req, res, next) => {
    const { name, city, description, type } = req.body
    const imgUrl = req.file.path

    City.findOne({ name: city })
        .then(existingCity => {
            if (!existingCity) {
                return res.status(404).json({ message: "City not found" })
            }

            const newPlace = new Place({
                name,
                city: existingCity._id,
                description,
                type,
                imgUrl
            })

            return newPlace.save()
        })
        .then(savedPlace => {
            res.status(201).json(savedPlace)
        })
        .catch(error => {
            next(error)
        })
})

router.post("/places-upload", fileUploader.single("imgUrl"), (req, res, next) => {
   
    if (!req.file) {
        next(new Error("No file uploaded!"));
        return;
    }

    res.json({imgUrl: req.file.path}); //"imgUrl" is the ref for front-end
})


router.put("/places/:placeId", (req, res, next) => {
    const { placeId } = req.params
    const { name, city, description, type } = req.body

    City.findOne({ name: city })
        .then(existingCity => {
            if (!existingCity) {
                return res.status(404).json({ message: "City not found" })
            }

            return Place.findByIdAndUpdate(placeId, { name, city: existingCity._id, description, type }, { new: true })
        })
        .then(updatedPlace => {
            if (!updatedPlace) {
                return res.status(404).json({ message: "Place not found" })
            }
            res.json(updatedPlace)
        })
        .catch(error => {
            next(error)
        })
})



router.delete("/places/:placeId", (req, res, next) => {
    const { placeId } = req.params;

    Place.findByIdAndDelete(placeId)
        .then(deletedPlace => {
            if (!deletedPlace) {
                return res.status(404).json({ message: "Place not found" })
            }
            res.status(204).end()
        })
        .catch(error => {
            next(error)
        })
})

router.post('/places/:placeId/reviews', isAuthenticated, (req, res) => {
    let token = getTokenFromHeaders(req)
  let payload;

    try{
      payload = jwt.verify(token, process.env.TOKEN_SECRET)
    } catch(err){
      return next(err.mssage)
    }

    const { rating, review } = req.body;
    Review.create({ user: payload._id, place: req.params.placeId, rating, review })
      .then(newReview => {
        res.status(201).json(newReview);
      })
      .catch(err => {
        res.status(500).json({ message: err.message });
        
      });
  });



  router.get('/places/:placeId/reviews', (req, res) => {
    Review.find({ place: req.params.placeId })
      .then(reviews => {
        res.json(reviews);
      })
      .catch(err => {
        res.status(500).json({ message: err.message });
      });
  });
  
  router.get('/places/:placeId/reviews/:reviewId', (req, res) => {
    Review.findOne({ _id: req.params.reviewId, place: req.params.placeId })
      .then(review => {
        if (review) {
          res.json(review);
        } else {
          res.status(404).json({ message: 'Review not found' });
        }
      })
      .catch(err => {
        res.status(500).json({ message: err.message });
      });
  });
  
  router.put('/places/:placeId/reviews/:reviewId', (req, res) => {
    const { rating, review } = req.body;
    Review.findOneAndUpdate({ _id: req.params.reviewId, place: req.params.placeId }, { rating, review }, { new: true })
      .then(updatedReview => {
        res.json(updatedReview);
      })
      .catch(err => {
        res.status(500).json({ message: err.message });
      });
  });
  
  router.delete('/places/:placeId/reviews/:reviewId', (req, res) => {
    Review.findOneAndDelete({ _id: req.params.reviewId, place: req.params.placeId })
      .then(() => {
        res.json({ message: 'Review deleted' });
      })
      .catch(err => {
        res.status(500).json({ message: err.message });
      });
  });
  
  module.exports = router;


  router.get('/places/:type', (req, res) => {
    const type = req.params.type;
  
    const placesQuery = Place.find({ type }).populate('city', 'name');
  
    placesQuery
      .then((places) => {
        res.json(places);
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  });


