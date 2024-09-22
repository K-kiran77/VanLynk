import { Link } from "react-router-dom"
import {useEffect} from "react"

function Home() {

    useEffect(() => {
        const authData = JSON.parse(localStorage.getItem("authData")) || {};
        const timer = setTimeout(() => {
            if(!authData.loggedIn) alert("use b@b.com as email and p123 as password to try the website");
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="home--container">
            <h1 className="home--header">You got the travel plans, we got the travel vans.</h1>
            <p className="home--subtext">Add adventure to your life by joining the #vanlynk movement. Rent the perfect van to make your perfect road trip.</p>

            <Link to="vans">
                Find your van
            </Link>
        </div>
    )
}

export default Home