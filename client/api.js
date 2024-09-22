export async function getVans() {
    const res = await fetch("http://localhost:3000/vans", { credentials: "include" })
    if (!res.ok) {
        const error = {
            message: "Failed to fetch vans",
            statusText: res.statusText,
            status: res.status,
        }
        console.error("Error in getVans:", error)
        throw error
    }
    const data = await res.json()
    return data.vans
}

export async function getVanById(id) {
    const res = await fetch(`http://localhost:3000/vans/${id}`, { credentials: "include" })
    if (!res.ok) {
        const error = {
            message: `Failed to fetch van by id: ${id}`,
            statusText: res.statusText,
            status: res.status,
        }
        console.error("Error in getVanById:", error)
        throw error
    }
    const data = await res.json()
    return data.van
}

export async function getHostVans() {
    const res = await fetch("http://localhost:3000/host/vans", { credentials: "include" })
    if (!res.ok) {
        const error = {
            message: "Failed to fetch host vans",
            statusText: res.statusText,
            status: res.status,
        }
        console.error("Error in getHostVans:", error)
        throw error
    }
    const data = await res.json()
    return data.hostVans
}

export async function getHostVanById(id) {
    const res = await fetch(`http://localhost:3000/host/vans/${id}`, { credentials: "include" })
    if (!res.ok) {
        const error = {
            message: `Failed to fetch host van by id: ${id}`,
            statusText: res.statusText,
            status: res.status,
        }
        console.error("Error in getHostVanById:", error)
        throw error
    }
    const data = await res.json()
    return data.hostVan
}

export async function getHostRentedVans() {
    const res = await fetch("http://localhost:3000/host/vans/rented", { credentials: "include" })
    if (!res.ok) {
        const error = {
            message: "Failed to fetch host rented vans",
            statusText: res.statusText,
            status: res.status,
        }
        console.error("Error in getHostRentals:", error)
        throw error
    }
    const data = await res.json()
    return data.hostRentedVans
}

export async function getHostReviews() {
    const res = await fetch("http://localhost:3000/host/reviews", { credentials: "include" })
    if (!res.ok) {
        const error = {
            message: "Failed to fetch host reviews",
            statusText: res.statusText,
            status: res.status,
        }
        console.error("Error in getHostReviews:", error)
        throw error
    }
    const data = await res.json()
    return data.hostReviews
}

export async function getUserRentals() {
    const res = await fetch("http://localhost:3000/rentals", { credentials: "include" })
    if (!res.ok) {
        const error = {
            message: "Failed to fetch user rentals",
            statusText: res.statusText,
            status: res.status,
        }
        console.error("Error in getUserRentals:", error)
        throw error
    }
    const data = await res.json()
    return data.rentals
}

export async function registerUser(creds) {
    const res = await fetch("http://localhost:3000/register",
    {
        method: "POST",
        body: JSON.stringify(creds),
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    })
    const data = await res.json();
    if (!res.ok) {
        throw {
            message: data.message,
            statusText: res.statusText,
            status: res.status
        }
    }
    return data
}

export async function loginUser(creds) {
    const res = await fetch("http://localhost:3000/login", 
        { 
            method: "POST", 
            body: JSON.stringify(creds),
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        }
    )
    const data = await res.json();
    if (!res.ok) {
        throw {
            message: data.message,
            statusText: res.statusText,
            status: res.status
        }
    }
    return data
}

export async function logoutUser() {
    const res = await fetch("http://localhost:3000/logout", { credentials: "include" })
    const data = await res.json();
    if (!res.ok) {
        throw new Error(`Logout failed: ${data.message}`);
    }
    return data
}

export async function rentVan(id, totalCost, startDate, endDate) {
    const res = await fetch(`http://localhost:3000/vans/${id}/rent`,
        {
            method: 'POST',
            body: JSON.stringify({ totalCost, startDate, endDate }),
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        } 
    )
    const data = await res.json();
    if (!res.ok) {
        throw {
            message: data.message,
            statusText: res.statusText,
            status: res.status
        }
    }
    return data
}

export async function postUserReview(email, vanId, rating, description) {
    const res = await fetch(`http://localhost:3000/rentals/review`, 
        {
            method: 'POST',
            body: JSON.stringify({ email, vanId, rating, description }),
            headers: {
                "Content-Type": "application/json",
            },
        }
    )
    const data = await res.json();
    if (!res.ok) {
        throw {
            message: data.message,
            statusText: res.statusText,
            status: res.status
        }
    }
    return data
}

export async function addVan(name, type, price, description, imageFile) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('type', type);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('imageFile', imageFile);

    const res = await fetch(`http://localhost:3000/host/vans`, 
        {
            method: 'POST',
            body: formData,
            credentials: "include",
        }
    )
    const data = await res.json();
    if (!res.ok) {
        throw {
            message: data.message,
            statusText: res.statusText,
            status: res.status
        }
    }
    return data
}

export async function updateVan(id, name, type, price, description, imageFile, imageURL) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('type', type);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('imageFile', imageFile);
    formData.append('imageURL', imageURL);

    const res = await fetch(`http://localhost:3000/host/vans/${id}`, 
        {
            method: 'PUT',
            body: formData,
            credentials: "include",
        }
    )
    const data = await res.json();
    if (!res.ok) {
        throw {
            message: data.message,
            statusText: res.statusText,
            status: res.status
        }
    }
    return data
}

export async function deleteVan(id) {
    const res = await fetch(`http://localhost:3000/host/vans/${id}`,
        {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        }
    )
    const data = await res.json();
    if (!res.ok) {
        throw {
            message: data.message,
            statusText: res.statusText,
            status: res.status
        }
    }
    return data 
}