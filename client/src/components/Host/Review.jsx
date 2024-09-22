import PropTypes from 'prop-types';
import { BsStarFill } from "react-icons/bs"
import { formatDate } from "../../../utils"

function Review(props) {
    return (
        <div className="review--container">
            {Array.from({ length: props.rating }, (_, i) => (
                <BsStarFill className="review--star" key={i} />
            ))}
            <div className="review--info">
                <p className="review--name">{props.first_name} {props.last_name}</p>
                <p className="review--date">{formatDate(props.date)}</p>
            </div>
            <p>{props.description}</p>
            <hr />
        </div>
    )
}

Review.propTypes = {
    rating: PropTypes.number,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    date: PropTypes.string,
    description: PropTypes.string,
}

export default Review