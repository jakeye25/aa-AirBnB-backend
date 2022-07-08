const express = require('express');
const { restoreUser } = require('../../utils/auth');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, Review, Booking, Image, sequelize } = require('../../db/models');
const user = require('../../db/models/user');
// ...
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
// ...

const router = express.Router();


//get all spots
router.get('/', async (req, res) => {
    const spots = await Spot.findAll()
    res.json(spots)
  })

//get spot by soptId
router.get('/:id', async (req, res, next) => {
    const spots = await Spot.findOne({
        where:{ id: req.params.id},
        attributes:{
            include:[
                [
                    sequelize.fn("COUNT", sequelize.col("Reviews.review")), "numReviews"
                ],
                [
                    sequelize.fn("AVG", sequelize.col("Reviews.stars")), "avgStarRating"
                ]
            ]
        },
        include: [{
            model: Review,
            as: 'reviews',
            attributes: []
          },
          {
            model: Image,
            as: 'images',
            attributes: ['url']
          },
          {
            model: User,
            as: 'Owner',
            attributes: ['id', 'firstName', 'lastName']
          }
        ],
});

    if(!spots.id) {
        const err = Error("Spot couldn't be found");
        err.status = 404;
        err.title = "Spot couldn't be found";
        err.message = "Spot couldn't be found";
        return next(err);
    }
    res.json(spots)
  })

//create spot
router.post(
  '/', restoreUser, requireAuth,
   async (req, res, next) => {
    let { address, city, state, country, lat, lng, name, description, price } = req.body;

    const error = {
      message: "Validation error",
      statusCode: 400,
      errors: {}
    }

    if (!address) error.errors.address = "Address is required."
    if (!city) error.errors.city= "City is required."
    if (!state) error.errors.state = "State is required."
    if (!country) error.errors.country = "Country is required."
    if (!lat) error.errors.lat = "Latitude is not valid."
    if (!lng) error.errors.lng = "Logitude is not valid."
    if (!name || name.length> 50) error.errors.name = "Name must be less than 50 characters."
    if (!description) error.errors.description = "Description is required."
    if (!price) error.errors.price = "Price per day is required."

      if (!address || !city || !state || !country || !lat || !lng || !name || !description || !price) {
        res.statusCode = 400;
        return res.json(error)
      }

      const spot = await Spot.create({
        ownerId: req.user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
      });

      res.status(201).json(spot);


  })


module.exports = router;
