import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registerUser } from "../../api"
import { useAuth } from "../hooks/AuthContext"

function Register() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm()
    

    async function onSubmit(data) {
        const { firstName, lastName, email, password, userType } = data
        
        setLoading(true);

        try {
            const { success, message } = await registerUser({
                firstName,
                lastName,
                email,
                password,
                userType,
            })

            if (success) {
                // pass user type here to save globally
                login(userType) // updates global context state
                toast.success("Welcome aboard! Your account has been successfully created.")
                navigate("/login")
            } else {
                console.error(`Registration failed: ${message}`);
            }
        } catch (err) {
            toast.error(err.message)
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="register--container">
            <h1>Create an account</h1>
            <ul className="error-list">
                {Object.keys(errors).map((key) => (
                    <li key={key} className="error-item">
                        {errors[key]?.message}
                    </li>
                ))}
            </ul>
            <form 
                className="register--form"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="register--names">
                    <input 
                        type="text"
                        {...register("firstName", { required: "Please provide a first name" })}
                        placeholder="First name"
                    />
                    <input 
                        type="text"
                        {...register("lastName", { required: "Please provide a last name" })}
                        placeholder="Last name"
                    />
                </div>
                <input 
                    type="email"
                    {...register("email", { required: "Please provide an email" })}
                    placeholder="Email address"
                />
                <div className="register--passwords">
                    <input 
                        type="password"
                        {...register("password", { required: "Please provide a password" })}
                        placeholder="Password"
                    />
                    <input 
                        type="password"
                        name="confirmPassword"
                        {...register("confirmPassword", { 
                            required: true,
                            validate: value => value === getValues("password") || "Passwords do not match"
                        })}
                        placeholder="Confirm password"
                    />
                </div>
                <div className="register--types">
                    <label>
                        Host
                        <input
                        type="radio"
                        {...register("userType", { required: "Please select a user type" })}
                        value="host"
                        />
                    </label>
                    <label>
                        Renter
                        <input
                        type="radio"
                        {...register('userType', { required: "Please select a user type"  })}
                        value="renter"
                        />
                    </label>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Creating account..." : "Create account"}
                </button>
            </form>
        </div>
    )
}

export default Register