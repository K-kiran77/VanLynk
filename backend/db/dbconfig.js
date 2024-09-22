import 'dotenv/config';

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/van_life';
const dbName = 'van_life';

export { mongoURI, dbName };