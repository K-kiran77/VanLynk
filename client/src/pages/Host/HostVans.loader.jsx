import { defer } from "react-router-dom"
import { getHostVans } from "../../../api"
import { requireAuth } from "../../../utils"

export async function loader({ request }) {
    await requireAuth(request)
    const allHostVansPromise = getHostVans()
    return defer({ allHostVans: allHostVansPromise })
}