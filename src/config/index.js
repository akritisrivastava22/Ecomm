import dotenv from "dotenv";

dotenv.config;

const config = {
    // it will use either of the two 
    PORT : process.env.PORT || 3000,
    MONGODB_URL: process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/backend"
}

export default config;