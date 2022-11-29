
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams} from 'react-router-dom'
import { createSpotBookings } from "../../store/booking";

import './bookingCreate.css'

function BookingCreateFormPage() {
    const history = useHistory()
    const dispatch = useDispatch();
    const {spotId} = useParams()

    const currUser = useSelector((state) => state.session.user)
    const userId = currUser?.id

    let today = new Date();

    let date=today.getFullYear()+ "-"+ parseInt(today.getMonth()+1) +"-"+today.getDate();

    let minStartDate = date
    let minEndDate = today.getFullYear() + "-"+ parseInt(today.getMonth()+1) +"-"+parseInt(today.getDate()+1);
    // console.log("today",date)
    // console.log("minenddate", minEndDate)

    const[startDate, setStartDate] = useState('')
    const[endDate, setEndDate] = useState('')
    // const [validations, setValidations] = useState(false);
    const [errors, setErrors] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault()


        const createPayload = {
            userId,
            spotId,
            startDate,
            endDate
        }

        let newBooking = dispatch(createSpotBookings(createPayload))

        if (newBooking) {history.push(`/mybookings`)}

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
                        onChange={(e) => setEndDate(e.target.value)}
                        ></input>
                    </div>
                </div>
                <button type="submit" className="spotformbutton__btn">Reserve</button>
            </form>
        </div>
    )

}

export default BookingCreateFormPage;
