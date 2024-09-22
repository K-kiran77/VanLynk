import { defer } from "react-router-dom"
import { getVans } from "../../../api"

export function loader() {
    const vansPromise = getVans()
    return defer({ allVans: vansPromise })
}