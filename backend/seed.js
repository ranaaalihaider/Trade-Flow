require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tradeflow');
        console.log('MongoDB Connected for Seeding...');

        // Check if user already exists
        const existingAdmin = await User.findOne({ email: 'admin@tradeflow.com' });
        
        if (existingAdmin) {
            console.log('SuperAdmin already exists!');
            process.exit(0);
        }

        // Create SuperAdmin
        await User.create({
            name: 'Super Admin',
            email: 'admin@tradeflow.com',
            password: 'password123',
            role: 'SuperAdmin'
        });

        console.log('SuperAdmin created successfully! You can now log in.');
        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedAdmin();
