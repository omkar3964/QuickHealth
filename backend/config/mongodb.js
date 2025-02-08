import mongoose from "mongoose";

const ConnectDB = async () => {
    try {
        // Connecting to the database
        await mongoose.connect(`${process.env.MONGODB_URI}/quickhealth`)
        
        mongoose.connection.on('connected', () => {
            console.log('Database connected');
        });

        mongoose.connection.on('error', (err) => {
            console.error(`Database connection error: ${err}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Database disconnected');
        });

    } catch (error) {
        console.error(`Error connecting to the database: ${error.message}`);
        process.exit(1); // Exit process with failure code
    }
};

// Gracefully close the connection when the process terminates
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Database connection closed due to app termination');
    process.exit(0);
});

export default ConnectDB;
