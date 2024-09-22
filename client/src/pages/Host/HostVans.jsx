import React, { useState } from "react"
import { useLoaderData, Await } from "react-router-dom"
import HostVan from "../../components/Host/HostVan"
import Loading from "../../components/Loading"
import Modal from "../../components/Host/Add/Modal"

function HostVans() {
    // defer promise
    const { allHostVans } = useLoaderData()

    // for modal add form
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    function renderHostVansElements(allHostVans) {
        if (allHostVans) {
            const hostVanElements = allHostVans.map(hostVan => {
                const {_id} = hostVan;
                return <HostVan key={_id} {...hostVan} isDashboard={false}/>
            })
    
            return (
                <>
                    <h1 className="host-vans--header">Your listed vans</h1>
                    <div className="host-vans--container">
                        {hostVanElements}
                    </div>
                </>
            )
        }
    }
    
    return (
        <div>
            
            <React.Suspense fallback={<Loading />}>
                <Await resolve={allHostVans}>
                    {renderHostVansElements}
                </Await>
            </React.Suspense>
            
            <div className="host-vans--btn">
                <button className="host-vans--add" onClick={handleOpen}>Add van</button>
                <Modal open={open} handleClose={handleClose} />
            </div>
        </div>
    )
}

export default HostVans