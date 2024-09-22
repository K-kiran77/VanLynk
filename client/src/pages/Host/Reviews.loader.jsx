import { requireAuth } from "../../../utils"
import { defer } from "react-router-dom"
import { getHostReviews } from "../../../api"

export async function loader({ request }) {
    await requireAuth(request)
    const hostReviewsPromise = getHostReviews()
    return defer({ hostReviews: hostReviewsPromise })
}