import { requireAuth } from "../../../utils"
import { defer } from "react-router-dom"
import { getHostRentedVans } from "../../../api"

export async function loader({ request }) {
    await requireAuth(request)
    const hostRentedVansPromise = getHostRentedVans()
    return defer({ hostRentedVans: hostRentedVansPromise })
}