const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = 'mongodb://127.0.0.1:27017/pmate_db';

async function testPersistence() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const testUsername = 'testuser_' + Date.now();
        const testUser = new User({
            username: testUsername,
            password: 'password123',
            full_name: 'Test Persistent User',
            phone_number: '08123456789',
            address: 'Jalan Persistence No. 1'
        });

        console.log('Saving test user...');
        await testUser.save();
        console.log('User saved successfully');

        const foundUser = await User.findOne({ username: testUsername });
        console.log('Found user in DB:', foundUser);

        if (foundUser.full_name === 'Test Persistent User') {
            console.log('VERIFICATION SUCCESS: Personal data persisted in MongoDB.');
        } else {
            console.log('VERIFICATION FAILED: Personal data MISSING in MongoDB.');
        }

        await User.deleteOne({ username: testUsername });
        console.log('Test user cleaned up');

        await mongoose.disconnect();
    } catch (error) {
        console.error('Test failed with error:', error);
    }
}

testPersistence();
