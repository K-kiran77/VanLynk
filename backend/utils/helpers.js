import conn from "../db/connection.js";
export const getPublicId = (imageURL) => {
    try {
        const urlParts = imageURL.split('/');
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        const publicId = publicIdWithExtension.split('.')[0];
        return publicId;
    } catch (error) {
        console.error('Error extracting public ID:', error);
        return null;
    }
}

export const bufferToDataUri = (buffer, mimetype = 'application/octet-stream') => {
    const base64String = buffer.toString('base64');
    return `data:${mimetype};base64,${base64String}`;
};

const handleQueryResults = (resolve, reject, error, results, key, operation, fetchOne) => {
    if (error) {
        reject(error);
    } else {
        if (operation === "insert" || operation === "update" || operation === "delete") {
            // For inserts, updates and deletes, resolve with a success message
            const response = `${operation} successful for ${key}`
            resolve(response);
        } else {
            // For selects, resolve with the data
            const data = results;

            const response = { [key]: null };

            if (data) {
                if (fetchOne) {
                    response[key] = data; 
                } else if (Array.isArray(data)) {
                    response[key] = data.length > 0 ? data : null;
                } else {
                    response[key] = [data];
                }
            }

            resolve(response);
        }
    }
};


export const executeQuery = async (collection, operation, query, options = { fetchOne: false }) => {
    const db = conn;
    try {
        let results;
        switch (operation) {
            case "find":
                results = options.fetchOne ? 
                    await db.collection(collection).findOne(query) :
                    await db.collection(collection).find(query).toArray();
                    console.log(results)
                break;
            case "insert":
                results = await db.collection(collection).insertOne(query);
                console.log(results);
                break;
            case "update":
                results = await db.collection(collection).updateOne(query.filter, query.update);
                break;
            case "delete":
                results = await db.collection(collection).deleteOne(query);
                console.log(`the delete results are ${results}`);
                break;
            default:
                throw new Error("Invalid operation from back");
        }
        return new Promise((resolve, reject) => {
            handleQueryResults(resolve, reject, null, results, collection, operation, options.fetchOne);
        });
    } catch (err) {
        console.error(err);
        return new Promise((resolve, reject) => {
            handleQueryResults(resolve, reject, err, null, collection, operation, options.fetchOne);
        });
    }
};