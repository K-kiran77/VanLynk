import { useOutletContext } from "react-router-dom";

function HostVanInfo() {
    const [hostVan] = useOutletContext();
    const {name, type, description} = hostVan;

    const capitalizeFirstLetter = (string) => string[0].toUpperCase() + string.slice(1);

    return (
        <p className="host-van-info">
            <span className="info-line"><span className="info-bold">Name: </span>{name}</span>
            <span className="info-line"><span className="info-bold">Category: </span>{capitalizeFirstLetter(type)}</span>
            <span className="info-line"><span className="info-bold">Description: </span>{description}</span>
            <span className="info-line"><span className="info-bold">Visibility: </span>Public</span>
        </p>
    )
}

export default HostVanInfo