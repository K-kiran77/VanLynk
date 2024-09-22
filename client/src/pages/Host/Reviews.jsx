import React from "react";
import { useLoaderData, Await } from "react-router-dom"
import { BsStarFill } from "react-icons/bs"
import Review from "../../components/Host/Review"
import RatingProgressBar from "../../components/Host/RatingProgressBar"
import { nanoid } from 'nanoid';
import Loading from "../../components/Loading";
import { isWithinLast30Days } from "../../../utils"

function Reviews() {
    // defer promise
    const { hostReviews } = useLoaderData()

    function renderHostReviewElements(hostReviews) {
        let overallRating = 0.0
        let reviewsWithinLast30Days = []
        let reviewElements = []
        if (hostReviews) {
            overallRating = (hostReviews.reduce((sum, review) => sum + review.rating, 0) / hostReviews.length).toFixed(1)
            reviewsWithinLast30Days = hostReviews.filter(review => isWithinLast30Days(review, "date"))
            reviewElements = reviewsWithinLast30Days.map(review => <Review key={nanoid()} {...review} />)
        }

        return (
            <>
                <div className="reviews--progress-container">
                    <div className="reviews--progress-header">
                        <h2>{overallRating}</h2>
                        <BsStarFill className="overall-rating" />
                        <p>overall rating</p>
                    </div>
                    <RatingProgressBar reviews={hostReviews || []} />
                </div>
                <div className="reviews--container">
                    <div>
                        <h3>Reviews ({reviewsWithinLast30Days.length})</h3>
                    </div>
                    {reviewElements}
                </div>
            </>
        )
    }

    return (
        <section className="reviews">
            <div className="reviews--header">
                <h2>Your reviews</h2>
                <p>Last <span>30 days</span></p>
            </div>
            <React.Suspense fallback={<Loading />}>
                <Await resolve={hostReviews}>
                    {renderHostReviewElements}
                </Await>
            </React.Suspense>
        </section>
    )
}

export default Reviews