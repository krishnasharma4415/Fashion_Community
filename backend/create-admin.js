const mongoose = require('mongoose');
const User = require('./models/User');

async function createAdmin() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb+srv://krishnas:krishna123@fashiondb.pcgsadn.mongodb.net/fashion-community?retryWrites=true&w=majority');
        console.log('Connected to MongoDB');

        // Find the admin user and update role
        const adminUser = await User.findOneAndUpdate(
            { email: 'admin@fashion.com' },
            { role: 'admin' },
            { new: true }
        );

        if (adminUser) {
            console.log('✅ Admin user updated successfully!');
            console.log(`   Username: ${adminUser.username}`);
            console.log(`   Email: ${adminUser.email}`);
            console.log(`   Role: ${adminUser.role}`);
        } else {
            console.log('❌ Admin user not found');
        }

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

createAdmin();