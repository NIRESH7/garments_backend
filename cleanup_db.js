import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';

dotenv.config();

const cleanupDatabase = async () => {
    try {
        await connectDB();

        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionNames = collections.map((col) => col.name);

        console.log(`Found ${collectionNames.length} collections.`);

        for (const name of collectionNames) {
            if (name === 'users') {
                console.log(`Skipping collection: ${name} (preserving user data)`);
                continue;
            }

            console.log(`Clearing collection: ${name}...`);
            const result = await mongoose.connection.db.collection(name).deleteMany({});
            console.log(`Deleted ${result.deletedCount} documents from ${name}.`);
        }

        const userCount = await mongoose.connection.db.collection('users').countDocuments();
        console.log(`Cleanup complete. ${userCount} users remaining.`);

        process.exit(0);
    } catch (error) {
        console.error(`Error during cleanup: ${error.message}`);
        process.exit(1);
    }
};

cleanupDatabase();
