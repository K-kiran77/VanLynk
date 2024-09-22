import { useState } from "react"
import { Link } from "react-router-dom"
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom"
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Modal from "../../components/Host/Edit/Modal"
import { deleteVan } from "../../../api"

function HostVan(props) {
    const navigate = useNavigate();
    // for modal add form
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    async function handleDeleteVan(vanId) {
        try {
            const { success, message } = await deleteVan(vanId)

            if (success) {
                toast.success("Van successfully deleted.")
                // Reload the page after a successful insertion
                navigate(window.location.pathname);
            } else {
                console.error("handleDeleteVan() error", message);
            }
        } catch (err) {
            toast.error("Error deleting the van:", err.message)
        }
    }

    return (
        <div className="host-van--container">
            <Link to={props.isDashboard ? `vans/${props._id.toString()}` : props._id.toString()} className="host-van--link">
                <img className="host-van--img" src={props.image_url} />


                <div className="host-van--info">
                    <h3 className="host-van--name">{props.name}</h3>
                    <p className="host-van--price">
                        ${props.price}<span>/day</span>
                    </p>
                </div>
            </Link>

            {!props.isDashboard && (
                <div className="host-van--actions">
                    <button className="host-van--edit-btn" onClick={handleOpen}>
                        <FaEdit />
                    </button>
                    <Modal 
                        open={open} 
                        handleClose={handleClose}
                        _id={props._id} 
                        name={props.name}
                        type={props.type}
                        price={props.price}
                        description={props.description}
                        image_url={props.image_url}
                    />
                    <button className="host-van--delete-btn" onClick={() => handleDeleteVan(props._id)}>
                        <FaTrash />
                    </button>
                </div>
            )}
        </div>
    )
}

HostVan.propTypes = {
    _id: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.number,
    type: PropTypes.string,
    description: PropTypes.string,
    image_url: PropTypes.string,
    isDashboard: PropTypes.bool,
}

export default HostVan