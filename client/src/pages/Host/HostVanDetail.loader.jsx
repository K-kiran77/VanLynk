import { defer } from "react-router-dom"
import { getHostVanById } from "../../../api"
import { requireAuth } from "../../../utils"

export async function loader({ params, request }) {
    await requireAuth(request)
    const hostVanPromise = getHostVanById(params.id)
    return defer({ hostVan: hostVanPromise })
}