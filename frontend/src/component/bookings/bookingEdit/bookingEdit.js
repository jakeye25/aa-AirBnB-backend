import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams} from 'react-router-dom'
import { editSpotBookings, getOwnerBookings, getSpotBookings } from "../../../store/booking";

import './bookingEdit.css'

function BookingEdit ({ booking, setShowModal }){
    const dispatch = useDispatch()
    const bookingSpotId = booking.spotId
    // console.log("check booking spot Id", bookingSpotId)
    // console.log("===========booking", booking)
    const currUser = useSelector((state) => state.session.user)
    const userId = currUser?.id

    const allspotBookings = useSelector((state) => state.booking)
    // console.log("check all booking edit", allspotBookings)

    const allspotBookingsArr = Object.values(allspotBookings)
    // console.log('++++++++++++allspotBookingsArr', allspotBookingsArr)

    const currSpotBookings = allspotBookingsArr.filter(e=> e.spotId==bookingSpotId)
    // console.log("check spot booking edit", currSpotBookings)
    const currBookings= currSpotBookings.filter(e=> e.id != booking?.id)
    console.log("--------------", currBookings)
    let today = new Date();

    let date=today.getFullYear()+ "-"+ parseInt(today.getMonth()+1) +"-"+today.getDate();

    let minStartDate = date
    let minEndDate = today.getFullYear() + "-"+ parseInt(today.getMonth()+1) +"-"+parseInt(today.getDate()+2);

    // useEffect(() => {
    //     dispatch(getSpotBookings(spotId))
    // }, [dispatch])

    const[startDate, setStartDate] = useState(booking?.startDate)
    const[endDate, setEndDate] = useState(booking?.endDate)
    // const [validations, setValidations] = useState(false);
    const [errors, setErrors] = useState([]);

    let day= new Date(startDate)
    let maxEndDate = day.getFullYear() + "-"+ parseInt(day.getMonth()+1) +"-"+parseInt(day.getDate()+6);

    const handleSubmit = (e) => {
        e.preventDefault()
        setErrors([]);

        const createPayload = {
            id: booking?.id,
            startDate,
            endDate
        }

        if(createPayload?.startDate>=createPayload.endDate)
        return setErrors(['Please enter a valid check out date.'])

        // if(currSpot?.ownerId == userId)
        // return setErrors(["You can't book your spot."])
        for (let i of currBookings) {
            if (
                (new Date(startDate).toISOString().slice(0, 10) >= i.startDate ||
                new Date(endDate).toISOString().slice(0, 10) >= i.startDate) &&
                (i.endDate >= new Date(endDate).toISOString().slice(0, 10) ||
                i.endDate >= new Date(startDate).toISOString().slice(0, 10))
              ) {
                return setErrors(["Sorry, this spot is already booked for the specified dates"])
        }
    }

        let newBooking = dispatch(editSpotBookings(createPayload))
        .catch (async (res) => {
        const data = await res.json()
        // console.log("ressssssssssss", res)
        // if(res.status ==403) return setErrors(["chech"])
        let errors = []
        if (data && data.message) {
          errors.push(data.message)
        }
        setErrors(errors)
      })

      if (newBooking) {
        dispatch(getOwnerBookings())
        setShowModal(false)}

    }


    return(
        <div className="create-booking-div" >
            <form className="bookingcreateform" onSubmit={handleSubmit}>
                <div className="bookingcreatedate-container">
                    <div className="bookingcreatedate-left">
                        <label>CHECK-IN</label>
                        <input
                        type='date'
                        value={startDate}
                        required
                        min={minStartDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        ></input>
                    </div>
                    <div className="bookingcreatedate-right">
                        <label>CHECK-OUT</label>
                        <input
                        type='date'
                        value={endDate}
                        required
                        min={minEndDate}
                        max={maxEndDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        ></input>
                    </div>
                </div>
                {errors.length > 0 &&
                    errors.map((error) => <div key={error}>{error}</div>)}
                <div className="delete-modal-item" onClick={() => setShowModal(false)}>Cancel</div>
                <button type="submit" className="spotformbutton__btn">Reserve</button>
            </form>
        </div>
    )
}

export default BookingEdit;
