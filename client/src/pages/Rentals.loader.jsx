import { defer } from "react-router-dom"
import { getUserRentals } from "../../api"

export function loader() {
    const rentalsPromise = getUserRentals()
    return defer({ rentals: rentalsPromise })
}