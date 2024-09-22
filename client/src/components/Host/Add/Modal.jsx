import { Dialog } from "@mui/material"
import PropTypes from 'prop-types';
import AddForm from "./AddForm";

function Modal(props) {
    return (
        <Dialog open={props.open} onClose={props.handleClose}>
            <AddForm handleClose={props.handleClose}/>
        </Dialog>
    )
}

Modal.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func,
}

export default Modal