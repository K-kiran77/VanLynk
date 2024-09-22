import { useOutletContext } from "react-router-dom";

function HostVanPricing() {
    const [hostVan] = useOutletContext();
    // format number to always show two decimal places
    const vanPrice = (Math.round(hostVan.price * 100) / 100).toFixed(2);

    return (
        <p className="host-van-pricing">
            ${vanPrice}<span>/day</span>
        </p>
    )
}

export default HostVanPricing