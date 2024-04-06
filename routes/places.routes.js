const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Place = require("../models/Place.model")
const City = require("../models/City.model")

router.post("/places", (req, res, next) => {
    const { name, city, description, type } = req.body

    // STEP 1: Check if the city exists
    City.findOne({ name: city })
        .populate("city")
        .then(existingCity => {
            if (!existingCity) {
                return res.status(404).json({ message: "City not found" })
            }

            // STEP 2: Create a new place
            const newPlace = new Place({
                name,
                city: existingCity._id,
                description,
                type
            });

            // STEP 3: Save the new place
            return newPlace.save()
        })
        .then(savedPlace => {
            res.status(201).json(savedPlace)
        })
        .catch(error => {
            next(error)
        });
});






module.exports = router
