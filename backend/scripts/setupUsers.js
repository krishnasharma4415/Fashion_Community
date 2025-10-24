const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Post = require('../models/Post');
const Follow = require('../models/Follow');
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
    username: 'rishita_gupta',
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
    username: 'kunal_singh',
    email: 'kunal@fashioncommunity.com',
    password: 'password123',
    bio: 'Streetwear enthusiast | Sneaker collector | Urban style 👟',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
  },
  {
    username: 'nishant_verma',
    email: 'nishant@fashioncommunity.com',
    password: 'password123',
    bio: 'Formal wear specialist | Business casual expert 👔',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
  },
  {
    username: 'kunj_patel',
    email: 'kunj@fashioncommunity.com',
    password: 'password123',
    bio: 'Casual chic | Weekend vibes | Comfort meets style 😎',
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face'
  }
];

async function setupUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    console.log('\n🚀 Setting up Fashion Community users...\n');

    // Create users
    const createdUsers = [];
    for (const userData of users) {
      const existingUser = await User.findOne({ 
        $or: [
          { email: userData.email },
          { username: userData.username }
        ]
      });

      if (existingUser) {
        console.log(`⚠️  User ${userData.username} already exists`);
        createdUsers.push(existingUser);
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

      const savedUser = await newUser.save();
      createdUsers.push(savedUser);
      console.log(`✅ Created user: ${userData.username}`);
    }

    console.log('\n🎉 All users have been set up successfully!');
    console.log('\n👥 User List:');
    createdUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.username} (${user.email})`);
    });

    console.log('\n🔑 Login Information:');
    console.log('   • Password for all users: password123');
    console.log('   • You can now log in with any of these accounts');
    
    console.log('\n💡 Next Steps:');
    console.log('   1. Start your backend server: npm start');
    console.log('   2. Start your frontend: npm run dev');
    console.log('   3. Log in with any user account');
    console.log('   4. Test the suggestions feature!');
    
  } catch (error) {
    console.error('❌ Error setting up users:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the setup function
setupUsers();