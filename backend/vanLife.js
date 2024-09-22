import { hash, compare } from 'bcrypt';
import { executeQuery } from "./utils/helpers.js"
import { ObjectId } from 'mongodb';
export const authenticateUser = async (email, password, userType) => {
    const collection = userType === "renter" ? "renters" : "owners";
    try {
        const result = await executeQuery(collection, "find", { email : email }, { fetchOne: true });
        if (result && result[collection]) {
            const isPasswordValid = await compare(password, result[collection].password);
            console.log(`checking password ${isPasswordValid}`);
            return isPasswordValid ? result : { [collection]: null };
        }
        return { [collection]: null };
    } catch (err) {
        console.error(err);
        throw new Error(err.message);
    }
}

export const getHostById = async (hostId) => {
    try {
        const result = await executeQuery("owners", "find", { _id: new ObjectId(hostId) }, { fetchOne: true });
        return result.owners;
    } catch (err) {
        console.error(err);
        throw new Error(err.message);
    }
}

export const getRenterById = async (renterId) => {
    try {
        const result = await executeQuery("renters", "find", { _id: new ObjectId(renterId) }, { fetchOne: true });
        return result.renters;
    } catch (err) {
        console.error(err);
        throw new Error(err.message);
    }
}

export const getVans = async () => {
    try {
        const result = await executeQuery("vans", "find", {});
        return result;
    } catch (err) {
        console.error(err);
        throw new Error(err.message);
    }
}

export const getAvailableVansForHost = async (hostId) => {
    try {
        const result = await executeQuery("vans", "find", { owner_id: { $ne: new ObjectId(hostId) } });
        return result;
    } catch (err) {
        console.error(err);
        throw new Error(err.message);
    }
}

export const getAvaliableVansForRenter = async () => {
    try {
        const currentDate = new Date();
        // First, get the van IDs that are currently rented
        const rentedVanIdsResult = await executeQuery("rentals", "find", {
            $and: [
                { start_date: { $lte: currentDate } },
                { end_date: { $gte: currentDate } }
            ]
        }, { projection: { van_id: 1 } });

        // Extract van_id values into an array
        const rentedVanIds = rentedVanIdsResult.rentals ? rentedVanIdsResult.rentals.map(rental => rental.van_id) : [];

        // Now use this array in the vans query
        const result = await executeQuery("vans", "find", {
            _id: { $nin: rentedVanIds }
        });

        return result;
    } catch (err) {
        console.error(err);
        throw new Error(err.message);
    }
}

export const getVanById = async (vanId) => {
    try {
        const result = await executeQuery("vans", "find", { _id: new ObjectId(vanId) }, { fetchOne: true });
        return result;
    } catch (err) {
        console.error(err);
        throw new Error(err.message);
    }
}

export const getVanByName = async (name) => {
    try {
        const result = await executeQuery("vans", "find", { name:name }, { fetchOne: true });
        return result;
    } catch (err) {
        console.error(err);
        throw new Error(err.message);
    }
}

export const getVanByNameExcludingId = async (vanId, name) => {
    try {
        const result = await executeQuery("vans", "find", { _id: { $ne: new ObjectId(vanId) }, name }, { fetchOne: true });
        return result;
    } catch (err) {
        console.error(err);
        throw new Error(err.message);
    }
}

export const getHostVans = async (hostId) => {
    try {
        const result = await executeQuery("vans", "find", { owner_id: new ObjectId(hostId) });
        return result;
    } catch (err) {
        console.error(err);
        throw new Error(err.message);
    }
}

export const getHostVanById = async (hostId, vanId) => {
    try {
        const result = await executeQuery("vans", "find", { owner_id: new ObjectId(hostId), _id: new ObjectId(vanId) }, { fetchOne: true });
        return result;
    } catch (err) {
        console.error(err);
        throw new Error(err.message);
    }
}

export const getHostRentedVans = async (hostId) => {
    try {
        // First, get the van IDs owned by the host
        const vansResult = await executeQuery("vans", "find", { owner_id: new ObjectId(hostId) });
        
        // Extract the van IDs into an array
        const vanIds = vansResult.vans ? vansResult.vans.map(van => van._id) : [];

        // Now use this array in the rentals query
        const result = await executeQuery("rentals", "find", {
            van_id: { $in: vanIds }
        });
        console.log(`host rented vans result:`)
        console.log(result.rentals)
        console.log("host rented vans result end")
        return result;
    } catch (err) {
        console.error(err);
        throw new Error(err.message);
    }
}

export const getHostReviews = async (hostId) => {
    try {
        // First, get the van IDs owned by the host
        const vansResult = await executeQuery("vans", "find", { owner_id: new ObjectId(hostId) });
        
        // Extract the van IDs into an array
        const vanIds = vansResult.vans ? vansResult.vans.map(van => van._id) : [];

        // Now use this array in the reviews query
        const result = await executeQuery("reviews", "find", {
            van_id: { $in: vanIds }
        });

        return result;
    } catch (err) {
        console.error(err);
        throw new Error(err.message);
    }
}

export const getUserRentals = async (email) => {
    try {
        const result = await executeQuery("rentals", "find", { email });
        return result;
    } catch (err) {
        console.error(err);
        throw new Error(err.message);
    }
}

// INSERTS

export const insertOwner = async (email, password, firstName, lastName) => {
    try {
        const hashedPassword = await hash(password, 10);
        const result = await executeQuery("owners", "insert", {
            email,
            password: hashedPassword,
            first_name: firstName,
            last_name: lastName
        });
        return result;
    } catch (err) {
        console.error(err);
        throw new Error(err.message);
    }
}

export const insertRenter = async (email, password, firstName, lastName) => {
    try {
        const hashedPassword = await hash(password, 10);
        const result = await executeQuery("renters", "insert", {
            email,
            password: hashedPassword,
            first_name: firstName,
            last_name: lastName
        });
        return result;
    } catch (err) {
        console.error(err);
        throw new Error(err.message);
    }
}

export const insertRental = async (vanId, imageURL, email, totalCost, startDate, endDate) => {
    try {
        const result = await executeQuery("rentals", "insert", {
            van_id: new ObjectId(vanId),
            image_url: imageURL,
            email:email,
            total_cost: totalCost,
            placed_date: new Date(),
            start_date: startDate,
            end_date: endDate
        });
        return result;
    } catch (err) {
        console.error(err);
        throw new Error(err.message);
    }
}

export const insertReview = async (email, vanId, rating, description) => {
    try {
        const result = await executeQuery("reviews", "insert", {
            email,
            van_id: new ObjectId(vanId),
            rating,
            description
        });
        return result;
    } catch (err) {
        console.error(err);
        throw new Error(err.message);
    }
}

export const insertVan = async (hostId, name, type, price, description, imageURL) => {
    try {
        const result = await executeQuery("vans", "insert", {
            owner_id: new ObjectId(hostId),
            name,
            price,
            description,
            image_url: imageURL,
            type
        });
        return result;
    } catch (err) {
        console.error(err);
        throw new Error(err.message);
    }
}

// UPDATES
export const updateVan = async (vanId, name, type, price, description, imageURL) => {
    try {
        const result = await executeQuery("vans", "update", {
            filter: { _id: new ObjectId(vanId) },
            update: {
                $set: {
                    name,
                    price,
                    description,
                    image_url: imageURL,
                    type
                }
            }
        });
        return result;
    } catch (err) {
        console.error(err);
        throw new Error(err.message);
    }
}

// DELETES

export const deleteVan = async (vanId) => {
    try {
        const result = await executeQuery("vans", "delete", { _id: new ObjectId(vanId) });
        return result;
    } catch (err) {
        console.error(err);
        throw new Error(err.message);
    }
}