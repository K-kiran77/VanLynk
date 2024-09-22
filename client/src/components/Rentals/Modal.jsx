import { Dialog } from "@mui/material"
import PropTypes from 'prop-types';
import ReviewForm from "./ReviewForm";

function Modal(props) {
    return (
        <Dialog open={props.open} onClose={props.handleClose}>
            <ReviewForm vanId={props.vanId} email={props.email} handleClose={props.handleClose}/>
        </Dialog>
    )
}

Modal.propTypes = {
    vanId: PropTypes.string,
    email: PropTypes.string,
    open: PropTypes.bool,
    handleClose: PropTypes.func,
}

export default Modal