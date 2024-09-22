import { NavLink } from "react-router-dom";

function HostNavbar() {
    const activeStyles = {
        color: "#161616",
        fontWeight: "700",
        textDecoration: "underline",
        textUnderlineOffset: "4px",
    }

    return (
        <nav className="host--nav">
            <NavLink 
                to="."
                end 
                style={( {isActive} ) => isActive ? activeStyles : null}
            >
                Dashboard
            </NavLink>
            <NavLink 
                to="income"
                style={( {isActive} ) => isActive ? activeStyles : null}
            >
                Income
            </NavLink>
            <NavLink 
                to="vans"
                style={( {isActive} ) => isActive ? activeStyles : null}
            >
                My Vans
            </NavLink>
            <NavLink 
                to="reviews"
                style={( {isActive} ) => isActive ? activeStyles : null}
            >
                Reviews
            </NavLink>
        </nav> 
    )
}

export default HostNavbar