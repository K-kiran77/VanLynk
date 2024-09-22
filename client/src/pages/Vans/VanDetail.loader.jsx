import { defer } from "react-router-dom"
import { getVanById } from "../../../api"

export function loader({ params }) {
    const vanPromise = getVanById(params.id)
    return defer({ van: vanPromise })
}