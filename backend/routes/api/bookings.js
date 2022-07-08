const express = require('express');
const { restoreUser } = require('../../utils/auth');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, User, Review, Booking, Image, sequelize } = require('../../db/models');
const user = require('../../db/models/user');
const spot = require('../../db/models/spot');
const { Op } = require('sequelize');
// ...
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const booking = require('../../db/models/booking');
// ...

const router = express.Router();

//get all bookings
router.get('/', async (req, res) => {
    const bookings = await Booking.findAll()
    res.json(bookings)
  })

//edit a booking
router.put(
    '/:bookingId', restoreUser,
    async (req, res, next) => {
        let {startDate, endDate} = req.body;

        let bookingId = req.params.bookingId;
    const editBooking = await Booking.findByPk(bookingId);

    if(!editBooking) {
        res.status(404).json({message: "Booking couldn't be found",
    statusCode: 404})}

    let todayDate = new Date().toISOString().slice(0, 10)

    if(startDate > endDate || startDate<todayDate || endDate< todayDate) {
        res.status(403).json({
            message: "Sorry, this spot is already booked for the specified dates",
            statusCode: 403,
            "errors": {
              "startDate": "Start date conflicts with an existing booking",
              "endDate": "End date conflicts with an existing booking"}
          })
    }


  if(editBooking.endDate < todayDate) {
     res.status(400).json({message: "Past bookings can't be modified",
statusCode: 400})}


    editBooking.startDate = startDate
    editBooking.endDate = endDate

    await editBooking.save()
    res.status(200).json(editBooking)
    })


//delete booking
router.delete(
    '/:bookingId', restoreUser, requireAuth,
    async (req, res, next) => {

    let bkId = req.params.bookingId;

    const deleteBooking = await Booking.findByPk(bkId);

    let todayDate = new Date().toISOString().slice(0, 10)
        // return res.json(deleteBooking.startDate)
    if(!deleteBooking) {
      return res.status(404).json({message: "Booking couldn't be found", statusCode: 404})}
// console.log(deleteBooking)
// res.send('delete booking')
    if(deleteBooking.startDate < todayDate) {
       return res.status(400).json({message: "Bookings that have been started can't be deleted",
  statusCode: 400})}

//     else{
    // await deleteBooking.destroy()
    await Booking.destroy({where : {id: req.params.bookingId}})
    // deleteBooking.save()
         res.status(200)
         res.json({message: "Successfully deleted", statusCode: 200})
        // res.send('deleted')
//     }
    }
    )

module.exports = router;
