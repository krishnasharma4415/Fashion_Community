const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const users = [
  {
    username: 'krishna_sharma',
    email: 'krishna@fashioncommunity.com',
    password: 'password123',
    bio: 'Fashion enthusiast | Style blogger | Trendsetter ✨',
    profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face'
  },
  {
    username: 'nafisa_rehmani',
    email: 'nafisa@fashioncommunity.com',
    password: 'password123',
    bio: 'Vintage lover | Sustainable fashion advocate 🌿',
    profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face'
  },
  {
    username: 'rishita_pentyala',
    email: 'rishita@fashioncommunity.com',
    password: 'password123',
    bio: 'Minimalist style | Clean aesthetics | Fashion photographer 📸',
    profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face'
  },
  {
    username: 'sona_sarojini',
    email: 'sona@fashioncommunity.com',
    password: 'password123',
    bio: 'Bollywood fashion | Traditional meets modern 💫',
    profilePicture: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face'
  },
  {
    username: 'kunal_sharma',
    email: 'kunal@fashioncommunity.com',
    password: 'password123',
    bio: 'Streetwear enthusiast | Sneaker collector | Urban style 👟',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
  },
  {
    username: 'nishant_tiwari',
    email: 'nishant@fashioncommunity.com',
    password: 'password123',
    bio: 'Formal wear specialist | Business casual expert 👔',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
  },
  {
    username: 'kunj_mittal',
    email: 'kunj@fashioncommunity.com',
    password: 'password123',
    bio: 'Casual chic | Weekend vibes | Comfort meets style 😎',
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face'
  }
];

async function seedUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Check if users already exist
    for (const userData of users) {
      const existingUser = await User.findOne({
        $or: [
          { email: userData.email },
          { username: userData.username }
        ]
      });

      if (existingUser) {
        console.log(`⚠️  User ${userData.username} already exists, skipping...`);
        continue;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Create new user
      const newUser = new User({
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        bio: userData.bio,
        profilePicture: userData.profilePicture,
        role: 'user'
      });

      await newUser.save();
      console.log(`✅ Created user: ${userData.username}`);
    }

    console.log('\n🎉 User seeding completed successfully!');
    console.log('\n📋 Created users:');
    users.forEach(user => {
      console.log(`   • ${user.username} (${user.email})`);
    });
    console.log('\n🔑 Default password for all users: password123');

  } catch (error) {
    console.error('❌ Error seeding users:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the seeding function
seedUsers();