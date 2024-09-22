import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form";
import PropTypes from 'prop-types';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { updateVan } from "../../../../api"

function EditForm(props) {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            name: props.name,
            type: props.type,
            price: props.price,
            description: props.description,
            imageData: props.image_url,
        }
    })

    const [isDirty, setIsDirty ] = useState(false)

    function handleFieldChange(name, value) {
        const defaultValue = props[name]
        setIsDirty(value !== defaultValue);
    }

    async function onSubmit(data) {
        const imageURL = props.image_url
        const { name, type, price, description, imageData } = data

        try {
            const imageFile = imageData[0]
            const { success, message } = await updateVan(props._id, name, type, price, description, imageFile, imageURL)

            if (success) {
                props.handleClose()
                toast.success("Update successful! Your van details have been successfully updated.")
                // Reload the page after a successful insertion
                navigate(window.location.pathname);
            } else {
                console.error(`Van updated failed: ${message}`);
            }
        } catch (err) {
            toast.error(err.message)
        }
    }

    return (
        <div className="edit-form--container">
            <ul className="error-list">
                {Object.keys(errors).map((key) => (
                    <li key={key} className="error-item">
                        {errors[key]?.message}
                    </li>
                ))}
            </ul>
            <form 
                className="edit--form"
                onSubmit={handleSubmit(onSubmit)}
            >
                <input 
                    type="text"
                    {...register("name", { 
                        required: "Please provide a name for your van",
                        onChange: (e) => {handleFieldChange("name", e.target.value)} 
                    })}
                    placeholder="Name"
                    className="edit--form-input"
                />
                <select 
                    {...register("type", { 
                        required: "Please select the type of van", 
                        onChange: (e) => {handleFieldChange("type", e.target.value)} 
                    })}
                >
                    <option value="" disabled hidden>Select Van Type</option>
                    <option value="simple">Simple</option>
                    <option value="rugged">Rugged</option>
                    <option value="luxury">Luxury</option>
                </select>
                <input 
                    type="number"
                    {...register("price", { 
                        required: "Please provide the price of your van",
                        min: {
                            value: 0,
                            message: "Please provide a valid price"
                        },
                        onChange: (e) => {handleFieldChange("price", e.target.value)} 
                    })}
                    min={0}
                    placeholder="Rate per day"
                    className="edit--form-input"
                />
                <textarea
                    {...register("description", { 
                        required: "Please provide a description of your van",
                        onChange: (e) => {handleFieldChange("description", e.target.value)} 
                    })}
                    placeholder="Include a van description"
                    rows={4} 
                />
                <input 
                    type="file"
                    {...register('imageData', { 
                        onChange: (e) => {handleFieldChange("imageData", e.target.value)}
                    })}
                    accept="image/*"
                />
                <button 
                    type="submit" 
                    className={`edit--btn ${!isDirty && 'disabled'}`} 
                    disabled={!isDirty}
                >
                    Update
                </button>
            </form>
        </div>
    )
}

EditForm.propTypes = {
    _id: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    price: PropTypes.number,
    description: PropTypes.string,
    image_url: PropTypes.string,
    handleClose: PropTypes.func,
}

export default EditForm