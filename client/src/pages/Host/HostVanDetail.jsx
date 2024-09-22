import React from "react"
import { Link, Outlet, useLoaderData, Await } from "react-router-dom"
import HostVanDetailNavbar from "../../components/Host/HostVanDetailNavbar"
import Loading from "../../components/Loading"

function HostVanDetail() {
    // defer promise
    const { hostVan } = useLoaderData()

    function renderHostVanDetailElement(hostVan) {
        let styles
        switch (hostVan.type) {
            case "simple":
                styles = { backgroundColor: "#E17654"}
                break;
            case "rugged":
                styles = { backgroundColor: "#115E59" }
                break;
            case "luxury":
                styles = { backgroundColor: "#161616" }
                break;
        }

        return (
            <>
                <Link
                    to=".."
                    relative="path"
                    className="back-button"
                >
                    &larr; <span>Back to your vans</span>
                </Link>
                <div className="host-van-detail--container">
                    <div className="host-van-detail">
                        <img src={hostVan.image_url} />

                        <div className="host-van-detail--info">
                            <h2 style={styles}>{hostVan.type}</h2>
                            <h1>{hostVan.name}</h1>
                            <p className="host-van-detail--price">
                                ${hostVan.price}<span>/day</span>
                            </p>
                        </div>
                    </div>
                    <HostVanDetailNavbar />

                    <Outlet context={[hostVan]}/>
                </div>
            </>
        )
    }

    return (
        <section>
            <React.Suspense fallback={<Loading />}>
                <Await resolve={hostVan}>
                    {renderHostVanDetailElement}
                </Await>
            </React.Suspense>
        </section>
    )
}

export default HostVanDetail