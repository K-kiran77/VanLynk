import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { logoutUser } from "../../api"
import { useAuth } from "../../src/hooks/AuthContext"

function Logout() {
    const { logout } = useAuth()
    const navigate = useNavigate()

    async function handleLogout() {
        try {
            const { success, message } = await logoutUser()

            if (success) {
                logout() // update auth state
                navigate('/') // redirect back to home
            } else {
                console.error("Logout failed:", message);
                return new Response(`Logout failed: ${message}`, { status: 401 });
            }
        } catch (err) {
            return err
        }
    }

    useEffect(() => {
        handleLogout();
    }, [])
    
    // Nothing to render
    return null;
}

export default Logout