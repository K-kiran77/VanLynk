import { Link } from "react-router-dom"
import PropTypes from 'prop-types';

function Van(props) {
    let styles
    switch (props.type) {
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
        <div className="van--container">
            <Link to={props._id} state={{ searchParams: props.searchParams, typeFilter: props.typeFilter}} className="van--link">
                <img className="van--img" src={props.image_url} />

                <div className="van--info">
                    <h3 className="van--name">{props.name}</h3>
                    <p className="van--price">
                        ${props.price}<span>/day</span>
                    </p>
                </div>
                <h3 className="van--type" style={styles}>{props.type}</h3>
            </Link>
        </div>
    )
}

Van.propTypes = {
    _id: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.number,
    image_url: PropTypes.string,
    type: PropTypes.string,
    searchParams: PropTypes.string,
    typeFilter: PropTypes.string,
}

export default Van