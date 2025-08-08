import dotenv from 'dotenv';

dotenv.config();
export const port = process.env.PORT;
export const dburl = process.env.mongo_url;
export const jwt_secret = process.env.jwt_secret;