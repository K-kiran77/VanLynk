import { useOutletContext } from "react-router-dom";

function HostVanPhotos() {
    const [hostVan] = useOutletContext();
    const {image_url} = hostVan;

    return (
        <img src={image_url} className="host-van-photos"/>
    )
}

export default HostVanPhotos