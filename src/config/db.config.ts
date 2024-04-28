import mongoose from "mongoose"
import { createDefaultAdmin } from "../utils/helpers";

export const connectDB = async () => {
    try {
        const DB_URI = `${process.env.MONGODB_URL}/${process.env.DB_NAME}`;
        const conn = await mongoose.connect(DB_URI as string);
        console.log(`DB connected -> ${conn.connection.name}`);

        // create default admin
        await createDefaultAdmin();
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};