import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginUser } from "../../api"
import { useAuth } from "../hooks/AuthContext"


function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // react-hook-form
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()

    // message for protected routes
    useEffect(() => {
        const message = new URL(window.location.href).searchParams.get("message")
        if (message) setMessage(message)
    }, [message])

    async function onSubmit(data) {
        const { email, password, userType } = data

        setLoading(true)

        const defaultPath = userType === "host" ? "/host" : "/"
        const pathname = new URL(window.location.href).searchParams.get("redirectTo") || defaultPath

        try {
            const { success, message } = await loginUser({ email, password, userType })

            if (success) {
                // pass user type here to save globally
                login(userType) // updates global context state
                toast.success("Welcome back! You have successfully logged in.")
                navigate(pathname) // redirect user back to host or whatever protected page he accessed
            } else {
                console.error(`Login failed: ${message}`)
                return new Response(`Login failed: ${message}`, { status: 401 });
            }
        } catch (err) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login--container">
            <div className="login--errors">
                <h1>Sign in to your account</h1>
                {message && <div className="message">{message}</div>}
                <ul className="error-list">
                    {Object.keys(errors).map((key) => (
                        <li key={key} className="error-item">
                            {errors[key]?.message}
                        </li>
                    ))}
                </ul>
            </div>
            <form
                className="login--form"
                onSubmit={handleSubmit(onSubmit)}
            >
                <input 
                    type="email"
                    {...register("email", { required: "Please provide your email" })}
                    placeholder="Email address"
                />
                <input 
                    type="password"
                    {...register("password", { required: "Please provide your password" })}
                    placeholder="Password"
                />
                <div className="login--types">
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
                        {...register('userType', { required: "Please select a user type" })}
                        value="renter"
                        />
                    </label>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Signing in ..." : "Sign in"}
                </button>
            </form>
            <div className="login--create">
                <p>
                    Don&#39;t have an account? <Link to="/register">Create one now</Link>
                </p>
            </div>
        </div> 
    )   
}

export default Login