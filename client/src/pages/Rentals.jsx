import React from "react"
import { Await, useLoaderData, Link } from "react-router-dom"
import Loading from "../components/Loading"
import Rental from "../components/Rentals/Rental"

function Rentals() {
    // defer promise
    const { rentals } = useLoaderData()

    function renderRentalsElements(rentals) {
        if (!rentals) {
            return (
                <div className="rentals--no-vans-container">
                    <h2>You have no rented vans at this time.</h2>
                    <Link to="/vans" className="link-button">
                        Explore our vans
                    </Link>
                </div>
            )
        }

        const rentalElements = rentals.map(rental => {
            return <Rental key={rental.rental_id} {...rental} />
        })

        return (
            <div className="rentals--container">
                {rentalElements}
            </div>
        )
    }

    return (
        <div>
            <React.Suspense fallback={<Loading />}>
                <Await resolve={rentals}>
                    {renderRentalsElements}
                </Await>
            </React.Suspense>
        </div>
    )
}

export default Rentals