import { NavLink } from "react-router-dom";

function HostVanDetailNavbar() {
    const activeStyles = {
        color: "#161616",
        fontWeight: "700",
        textDecoration: "underline",
        textUnderlineOffset: "4px",
    }

    return (
        <nav className="host-van-detail--nav">
            <NavLink 
                to="."
                end
                style={( {isActive} ) => isActive ? activeStyles : null}
            >
                Details
            </NavLink>
            <NavLink
                to="pricing"
                style={( {isActive} ) => isActive ? activeStyles : null}
            >
                Pricing
            </NavLink>
            <NavLink
                to="photos"
                style={( {isActive} ) => isActive ? activeStyles : null}
            >
                Photos
            </NavLink>
        </nav>
    )
}

export default HostVanDetailNavbar