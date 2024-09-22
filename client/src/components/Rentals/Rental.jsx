import { useState } from "react"
import PropTypes from 'prop-types';
import Modal from "./Modal"
import { formatDate } from "../../../utils"

function Rental(props) {
    // for modal review form
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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
        <div className="rental-container"> 
            <img className="rental--img" src={props.image_url} alt={props.name}/>
            {console.log(props.image_url)}
            <div className="rental-van--info">
                <h3 className="rental--type" style={styles}>{props.type}</h3>
                <h3 className="rental--name">{props.name}</h3>
                <p className="rental--cost">${props.total_cost}</p>

                <div className="rental-dates">
                    <p><strong>Start Date:</strong> {formatDate(props.start_date)}</p>
                    <p><strong>End Date:</strong> {formatDate(props.end_date)}</p>
                </div>
            </div>

            <button className="rental--review" onClick={handleOpen}>Leave a review</button>
            <Modal open={open} handleClose={handleClose} vanId={props.van_id} email={props.email} />
        </div>
    )
}

Rental.propTypes = {
    van_id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    total_cost: PropTypes.number,
    image_url: PropTypes.string,
    type: PropTypes.string,
    start_date: PropTypes.string,
    end_date: PropTypes.string,
}

export default Rental