const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Place = require("../models/Place.model")
const City = require("../models/City.model")
const Review = require("../models/Review.model");
const User = require("../models/User.model")


const fileUploader = require("../config/cloudinary.config");
const {
  isAuthenticated,
  getTokenFromHeaders,
} = require("../middleware/jwt.middleware");
const jwt = require("jsonwebtoken");

router.get("/places", (req, res, next) => {
  Place.find()
    .populate("city reviews")
    .then((places) => {
      res.json(places);
    })
    .catch((error) => {
      next(error);
    });
});

router.post("/places", (req, res, next) => {
  const { name, city, description, type, imageUrl } = req.body;

  City.findOne({ _id: city })
    .then((existingCity) => {
      if (!existingCity) {
        return res.status(404).json({ message: "City not found" });
      }

      const newPlace = new Place({
        name,
        city: existingCity._id,
        description,
        type,
        imageUrl,
      });

      return newPlace.save();
    })
    .then((savedPlace) => {
      res.status(201).json(savedPlace);
    })
    .catch((error) => {
      next(error);
    });
});

router.post(
  "/places-upload",
  fileUploader.single("imgUrl"),
  (req, res, next) => {
    if (!req.file) {
      next(new Error("No file uploaded!"));
      return;
    }

    res.json({ imgUrl: req.file.path }); //"imgUrl" is the ref for front-end
  }
);



router.get("/places/:placeId", (req, res, next) => {
  const { placeId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(placeId)) {
    res.status(400).json({ message: "Specified place id is not valid" });
    return;
  }

  Place.findById(placeId)
    .populate("city")
    .then((place) => res.json(place))
    .catch((err) => next(err));
});



router.put("/places/:placeId", (req, res, next) => {
  const { placeId } = req.params;
  const update = ({ name, city, description, type, imageUrl } = req.body);

  Place.findById(placeId)
    .then(async (place) => {
      if (!place) {
        throw new Error("Place not found");
      }

      const updatedPlace = await Place.findByIdAndUpdate(placeId, update, {
        new: true,
      });

      return res.json(updatedPlace);
    })
    .catch((error) => {
      next(error);
    });
});

router.delete("/places/:placeId", (req, res, next) => {
  const { placeId } = req.params;

  Place.findByIdAndDelete(placeId)
    .then((deletedPlace) => {
      if (!deletedPlace) {
        throw new Error("Place not found");
      }
      res.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});

router.post("/places/:placeId/reviews", isAuthenticated, (req, res) => {
  let token = getTokenFromHeaders(req);
  let payload;

  try {
    payload = jwt.verify(token, process.env.TOKEN_SECRET);
  } catch (err) {
    return next(err.mssage);
  }

  const { rating, review } = req.body;
  Review.create({
    user: payload._id,
    place: req.params.placeId,
    rating,
    review,
  })
    .then(async (newReview) => {
      Place.findByIdAndUpdate(newReview.place, {
        $push: { reviews: newReview._id },
      }).then(async (result) => {
        res.status(201).json(await newReview.populate("user"));
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

router.get("/places/:placeId/reviews", (req, res) => {
  Review.find({ place: req.params.placeId })
    .sort({ createdAt: -1 })
    .populate("user")
    .then((reviews) => {
      res.json(
        reviews.map((review) => {
          review.user = { email: review.user.email, _id: review.user._id };
          return review;
        })
      );
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

router.get("/places/:placeId/reviews/:reviewId", (req, res) => {
  Review.findOne({ _id: req.params.reviewId, place: req.params.placeId })
    .then((review) => {
      if (review) {
        res.json(review);
      } else {
        res.status(404).json({ message: "Review not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

router.put("/places/:placeId/reviews/:reviewId", (req, res) => {
  const { rating, review } = req.body;
  Review.findOneAndUpdate(
    { _id: req.params.reviewId, place: req.params.placeId },
    { rating, review },
    { new: true }
  )
    .then((updatedReview) => {
      res.json(updatedReview);
    })
    .catch((err) => {
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


  router.post('/places/:placeId/favorites', (req, res) => {
    const { placeId } = req.params;
    const { userId } = req.body;
  
    User.findByIdAndUpdate(userId,{$push:{favoritesPlaces:placeId}},{new:true})
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

  router.delete('/places/:placeId/favorites/:userId', (req, res) => {
    const { placeId, userId } = req.params;

    User.findByIdAndUpdate(userId, { $pull: { favoritesPlaces: placeId } }, { new: true })
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ message: 'Place removed from favorites successfully' });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Server Error' });
        });
});


  module.exports = router;
