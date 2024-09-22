import { Outlet } from "react-router-dom"
import HostNavbar from "./HostNavbar"

function HostLayout() {
    return (
        <>
            <HostNavbar />

            <Outlet />
        </>
    )
}

export default HostLayout