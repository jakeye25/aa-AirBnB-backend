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
  '/', async (req, res, next) => {
    let { address, city, state, country, lat, lng, name, description, price } = req.body;

    const error = {
      message: "Validation error",
      statusCode: 400,
      errors: {}
    }

    if (!email) error.errors.email = "Invalid Email"
      if (!firstName) error.errors.firstname= "First Name is required."
      if (!lastName) error.errors.lastname = "Last Name is required."


      if (!email || !lastName || !firstName) {
        res.statusCode = 400;
        return res.json(error)
      }
  })


module.exports = router;
