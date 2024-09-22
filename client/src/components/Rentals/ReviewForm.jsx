import { useState } from "react"
import { useForm } from "react-hook-form";
import { Rating } from '@mui/material';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { postUserReview } from "../../../api"


function ReviewForm(props) {
    // react-hook-form
    const {
        register,
        handleSubmit,
        setValue,
    } = useForm()

    const [rating, setRating] = useState(0);

    async function onSubmit(data) {
        const { rating, description } = data
        
        try {
            const { success, message } = await postUserReview(props.email, props.vanId, rating, description)

            if (success) {
                props.handleClose()
                toast.success("Thank you! Your review has been successfully submitted.")
            } else {
                console.error("postUserReview() error", message);
            }
        } catch (err) {
            toast.error(err.message)
        }
    }

    return (
        <div className="review-form--container">
            <form
                className="review--form"
                onSubmit={handleSubmit(onSubmit)}
            >
                <Rating
                    name="simple-controlled"
                    value={rating}
                    size="large"
                    onChange={(event, newValue) => {
                        setValue("rating", newValue),
                        setRating(newValue);
                    }}
                />
                <textarea
                    rows={4}
                    placeholder="Share details of your own experience"
                    {...register("description", { required: true })}
                />
                <button type="submit">Post</button>
            </form>
        </div>
    )
}

ReviewForm.propTypes = {
    vanId: PropTypes.string,
    email: PropTypes.string,
    handleClose: PropTypes.func,
}

export default ReviewForm