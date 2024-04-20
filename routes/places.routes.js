const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const Place = require("../models/Place.model")
const City = require("../models/City.model")

const fileUploader = require("../config/cloudinary.config");




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






module.exports = router
