import { Link } from "react-router-dom"

function Unauthorized() {
    return (
        <div className="unauthorized">
            <h1>Sorry, the page you were looking for can only be accessed by hosts.</h1>
            <Link to="/">
                Return to home
            </Link>
        </div>
    )
}

export default Unauthorized