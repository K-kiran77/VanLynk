import { NavLink } from "react-router-dom"
import vanlynk from "../assets/images/vanlynk.png"
import { useAuth } from "../../src/hooks/AuthContext"

function Navbar() {
    const { authData } = useAuth();
    const { loggedIn, userType } = authData || {};

    const activeStyles = {
        textDecoration: "underline",
        textUnderlineOffset: "4px",
        color: "#161616"
    }

    return (
        <header>
            <NavLink to="/" className="nav--logo">
                <img src={vanlynk} alt="logo" />
            </NavLink>
            <nav>
                {(loggedIn && userType === "host") && (
                    <NavLink 
                        to="host"
                        style={( {isActive} ) => isActive ? activeStyles : null}
                    >
                        Host
                    </NavLink>
                )}
                <NavLink 
                    to="vans"
                    style={( {isActive} ) => isActive ? activeStyles : null}
                >
                    Vans
                </NavLink>
                <NavLink 
                    to="about"
                    style={( {isActive} ) => isActive ? activeStyles : null}
                >
                    About
                </NavLink>
                { loggedIn && (
                    <NavLink 
                        to="rentals"
                        style={( {isActive} ) => isActive ? activeStyles : null}
                    >
                        My Rentals
                    </NavLink>
                )}
                <NavLink 
                    to={loggedIn ? "logout" : "login"}
                    style={( {isActive} ) => isActive ? activeStyles : null}
                >
                    {loggedIn ? "Logout" : "Login"}
                </NavLink>
            </nav>
        </header>
    )
}

export default Navbar