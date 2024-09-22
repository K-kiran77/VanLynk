import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom"
import { useState } from "react";
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addVan } from "../../../../api"

function AddForm(props) {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            type: ""
        }
    })

    async function onSubmit(data) {
        setIsSubmitting(true)
        const { name, type, price, description, imageData } = data

        try {
            const imageFile = imageData[0]
            console.log(imageFile)
            const { success, message } = await addVan(name, type, price, description, imageFile)

            if (success) {
                props.handleClose()
                toast.success("Great news! Your van has been successfully added.")
                // Reload the page after a successful insertion
                navigate(window.location.pathname);
            } else {
                console.error(`Van insert failed: ${message}`);
            }
        } catch (err) {
            toast.error(err.message)
        }
        setIsSubmitting(false)
    }

    return (
        <div className="add-form--container">
            <ul className="error-list">
                {Object.keys(errors).map((key) => (
                    <li key={key} className="error-item">
                        {errors[key]?.message}
                    </li>
                ))}
            </ul>
            <form
                className="add--form"
                onSubmit={handleSubmit(onSubmit)}
            >
                <input
                    type="text"
                    {...register("name", { required: "Please provide a name for your van" })}
                    placeholder="Name"
                    className="add--form-input"
                />
                <select {...register("type", { required: "Please select the type of van" })}>
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
                        }
                    })}
                    min={0}
                    placeholder="Rate per day"
                    className="add--form-input"
                />
                <textarea
                    {...register("description", { required: "Please provide a description of your van" })}
                    placeholder="Include a van description"
                    rows={4}
                />
                <input
                    type="file"
                    {...register('imageData', {
                        required: 'Please provide an image file.',
                    })}
                    accept="image/*"
                />
                <button type="submit">{isSubmitting ? "Adding..." : "Add"}</button>
            </form>
        </div>
    )
}

AddForm.propTypes = {
    handleClose: PropTypes.func,
}

export default AddForm