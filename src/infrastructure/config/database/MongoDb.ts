import { MongoClient } from "mongodb";
const URL = process.env.DATABASE_URL
export const clientMongo = new MongoClient(URL);