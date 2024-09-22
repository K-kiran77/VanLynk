import PropTypes from 'prop-types';
function RatingProgressBar({ reviews }) {

    function calculatePercentage(rating) {
        const totalRatings = reviews ? reviews.length : 0

        if (totalRatings === 0) {
            return 0;
        }

        const ratingCount = reviews.filter(review => review.rating === rating).length;
        return Math.floor((ratingCount / totalRatings) * 100)
    }

    return (
        <div>
            {['5 stars', '4 stars', '3 stars', '2 stars', '1 star'].map((rating, index) => (
                <div key={index} className="rating--container">
                    <p>{rating}</p>
                    <div className="rating--progress" >
                        <div
                            className="rating--bar"
                            style={{
                                width: `${calculatePercentage(5 - index)}%`,
                            }}
                        />
                    </div>
                    <div className="rating--percentage">{`${calculatePercentage(5 - index)}%`}</div>
                </div>
            ))}
        </div>
    )
}

RatingProgressBar.propTypes = {
    reviews: PropTypes.arrayOf(PropTypes.object)
}

export default RatingProgressBar