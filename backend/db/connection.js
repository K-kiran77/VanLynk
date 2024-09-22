import mongoose from 'mongoose';
import { dbName, mongoURI } from './dbconfig.js';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 10000,
  dbName: dbName
});

const conn = mongoose.connection;

export default conn;