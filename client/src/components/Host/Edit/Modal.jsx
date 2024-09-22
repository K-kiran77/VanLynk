import { Dialog } from "@mui/material"
import PropTypes from 'prop-types';
import EditForm from "./EditForm";

function Modal(props) {
    return (
        <Dialog open={props.open} onClose={props.handleClose}>
            <EditForm 
                _id={props._id} 
                name={props.name}
                type={props.type}
                price={props.price}
                description={props.description}
                image_url={props.image_url}
                handleClose={props.handleClose}
            />
        </Dialog>
    )
}

Modal.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
    _id: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.number,
    type: PropTypes.string,
    description: PropTypes.string,
    image_url: PropTypes.string,
}

export default Modal