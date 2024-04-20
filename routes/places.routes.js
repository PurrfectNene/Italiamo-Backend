const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Place = require("../models/Place.model")
const City = require("../models/City.model")
const Review = require("../models/Review.model");


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


router.post("/places", (req, res, next) => {
    const { name, city, description, type } = req.body

    City.findOne({ name: city })
        .then(existingCity => {
            if (!existingCity) {
                return res.status(404).json({ message: "City not found" })
            }

            const newPlace = new Place({
                name,
                city: existingCity._id,
                description,
                type
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

router.post('/places/:placeId/reviews', (req, res) => {
    const { userId, rating, review } = req.body;
    Review.create({ user: userId, place: req.params.placeId, rating, review })
      .then(newReview => {
        res.status(201).json(newReview);
      })
      .catch(err => {
        res.status(500).json({ message: err.message });
      });
  });


  // Adding reviews here because they are linked with a specific place
  // need to work on authentication
  
  // Get Reviews for a Place
  router.get('/places/:placeId/reviews', (req, res) => {
    Review.find({ place: req.params.placeId })
      .then(reviews => {
        res.json(reviews);
      })
      .catch(err => {
        res.status(500).json({ message: err.message });
      });
  });
  
  // Get Review by ID
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
  
  // Update Review
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
  
  // Delete Review
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




