import React, { useState } from "react"
import { useNavigate, Link, useLocation, useLoaderData, Await } from "react-router-dom"
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/translucent.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from "../../components/Loading"
import { useAuth } from "../../hooks/AuthContext"
import { rentVan } from "../../../api"

function VanDetail() {
    const { authData } = useAuth();
    const { loggedIn } = authData || {};

    const { state } = useLocation()
    const navigate = useNavigate();
    
    // defer promise
    const { van } = useLoaderData()

    // similar to saying "state && state.searchParams" (kind of like conditional rendering)
    // if state exists we take value of state.searchParams if not just empty string
    const searchParams = state?.searchParams || ""
    const type = state?.typeFilter || "all"

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    async function handleRentVan(vanId, price) {
        const oneDay = 24*60*60*1000 // one day in ms
        const diffDaysMs = Math.abs(startDate - endDate)
        const numDays = Math.round(diffDaysMs/oneDay)
        const totalCost = price * numDays

        try {
            const {success, message} = await rentVan(vanId, totalCost, startDate, endDate);
            
            if (success) {
                toast.success("Congratulations! You have successfully rented the van. Enjoy your journey!")
                navigate("/rentals")
            } else {
                console.error("handleRentVan() error", message);
            }
        } catch (err) {
            console.error("Error renting the van:", err.message)
        }
    }

    function renderTippy(content, button) {
        return (
            <Tippy
                content={content}
                arrow={false}
                placement="bottom"
                animation="fade"
                theme="translucent"
            >
                {button}
            </Tippy>
        )
    }

    function renderRentButton(vanId, price) {
        const tippyContent = loggedIn 
            ? "You must select both a start date and end date"
            : "You must be logged in to rent a van";

        const button = (
            <button 
                className={`van-detail--rent ${(!loggedIn || !startDate || !endDate) && 'disabled'}`}
                onClick={() => {
                    if (!loggedIn || !startDate || !endDate) return
                    handleRentVan(vanId, price)
                }}
            >
                Rent this van
            </button>
        );

        if (!loggedIn) {
            return (
                renderTippy(tippyContent, button)
            )
        }

        const datePickers = (
            <div className="van-detail--dates">
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    minDate={new Date()} 
                    placeholderText="Start Date"
                    className="van-detail--date-picker"
                />
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate || new Date()}
                    placeholderText="End Date"
                    className="van-detail--date-picker"
                />
            </div>
        )
        
        /**
         * If not logged in, render Tippy with the button.
         * If logged in:
         *      If both start and end dates are selected, render the button directly.
         *      If either the start or end date is not selected, render Tippy with the button.
         */
        return (
            <> 
                {loggedIn && datePickers}
                {(!loggedIn || !startDate || !endDate) && renderTippy(tippyContent, button)}
                {startDate && endDate && button}
            </>
        )
    }

    function renderVanDetailElement(van) {
        let styles
        switch (van.type) {
            case "simple":
                styles = { backgroundColor: "#E17654"}
                break;
            case "rugged":
                styles = { backgroundColor: "#115E59" }
                break;
            case "luxury":
                styles = { backgroundColor: "#161616" }
                break;
        }

        return (
            <>
                <Link
                    to={`..${searchParams}`}
                    relative="path"
                    className="back-button"
                >&larr; <span>Back to {type} vans</span>
                </Link>
                <div className="van-detail--container">
                    <div className="van-detail">
                        <img src={van.image_url} />
                        <h2 style={styles}>{van.type}</h2>
                        <h1>{van.name}</h1>
                        <p className="van-detail--price">
                            ${van.price}<span>/day</span>
                        </p>
                        <p className="van-detail--description">{van.description} </p>

                        {renderRentButton(van._id, van.price)}
                    </div>    
                </div>
            </>
        )
    }
    
    return (
        <section>
            <React.Suspense fallback={<Loading />}>
                <Await resolve={van}>
                    {renderVanDetailElement}
                </Await>
            </React.Suspense>
        </section>
    )
}

export default VanDetail