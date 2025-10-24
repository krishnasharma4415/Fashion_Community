const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');
const Follow = require('../models/Follow');
require('dotenv').config();

const samplePosts = [
  // Krishna's posts
  {
    username: 'krishna_sharma',
    posts: [
      {
        caption: 'Loving this new summer collection! Perfect blend of comfort and style ☀️ #SummerFashion #StyleInspo',
        media: [{
          url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1080&h=1080&fit=crop',
          type: 'image'
        }]
      },
      {
        caption: 'Vintage vibes with a modern twist 💫 What do you think of this look? #VintageStyle #OOTD',
        media: [{
          url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1080&h=1080&fit=crop',
          type: 'image'
        }]
      }
    ]
  },
  // Nafisa's posts
  {
    username: 'nafisa_rehmani',
    posts: [
      {
        caption: 'Sustainable fashion is the future! This beautiful dress is made from recycled materials 🌿 #SustainableFashion #EcoFriendly',
        media: [{
          url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1080&h=1080&fit=crop',
          type: 'image'
        }]
      }
    ]
  },
  // Rishita's posts
  {
    username: 'rishita_gupta',
    posts: [
      {
        caption: 'Minimalism at its finest. Sometimes less is more ✨ #MinimalistStyle #CleanAesthetics',
        media: [{
          url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1080&h=1080&fit=crop',
          type: 'image'
        }]
      }
    ]
  },
  // Sona's posts
  {
    username: 'sona_sarojini',
    posts: [
      {
        caption: 'Traditional Indian wear never goes out of style! Feeling beautiful in this saree 💫 #TraditionalWear #IndianFashion',
        media: [{
          url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1080&h=1080&fit=crop',
          type: 'image'
        }]
      }
    ]
  },
  // Kunal's posts
  {
    username: 'kunal_singh',
    posts: [
      {
        caption: 'New sneaker drop! These are fire 🔥 #Streetwear #SneakerHead #UrbanStyle',
        media: [{
          url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1080&h=1080&fit=crop',
          type: 'image'
        }]
      }
    ]
  },
  // Nishant's posts
  {
    username: 'nishant_verma',
    posts: [
      {
        caption: 'Sharp and professional. Ready for that important meeting 👔 #BusinessCasual #ProfessionalStyle',
        media: [{
          url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1080&h=1080&fit=crop',
          type: 'image'
        }]
      }
    ]
  },
  // Kunj's posts
  {
    username: 'kunj_patel',
    posts: [
      {
        caption: 'Weekend vibes! Comfort is key when you want to look good and feel good 😎 #CasualChic #WeekendStyle',
        media: [{
          url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1080&h=1080&fit=crop',
          type: 'image'
        }]
      }
    ]
  }
];

// Sample follow relationships to create connections
const followRelationships = [
  { follower: 'krishna_sharma', following: 'nafisa_rehmani' },
  { follower: 'krishna_sharma', following: 'rishita_gupta' },
  { follower: 'nafisa_rehmani', following: 'krishna_sharma' },
  { follower: 'nafisa_rehmani', following: 'sona_sarojini' },
  { follower: 'rishita_gupta', following: 'krishna_sharma' },
  { follower: 'rishita_gupta', following: 'kunal_singh' },
  { follower: 'sona_sarojini', following: 'nafisa_rehmani' },
  { follower: 'sona_sarojini', following: 'nishant_verma' },
  { follower: 'kunal_singh', following: 'rishita_gupta' },
  { follower: 'kunal_singh', following: 'kunj_patel' },
  { follower: 'nishant_verma', following: 'sona_sarojini' },
  { follower: 'nishant_verma', following: 'kunal_singh' },
  { follower: 'kunj_patel', following: 'kunal_singh' },
  { follower: 'kunj_patel', following: 'krishna_sharma' }
];

async function seedUserContent() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Create posts for each user
    console.log('\n📝 Creating sample posts...');
    for (const userPosts of samplePosts) {
      const user = await User.findOne({ username: userPosts.username });
      if (!user) {
        console.log(`⚠️  User ${userPosts.username} not found, skipping posts...`);
        continue;
      }

      for (const postData of userPosts.posts) {
        // Check if similar post already exists
        const existingPost = await Post.findOne({
          userId: user._id,
          caption: postData.caption
        });

        if (existingPost) {
          console.log(`⚠️  Post already exists for ${userPosts.username}, skipping...`);
          continue;
        }

        const newPost = new Post({
          userId: user._id,
          caption: postData.caption,
          media: postData.media,
          // likeCount and commentCount will default to 0 (as defined in the model)
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random time within last week
        });

        await newPost.save();
        console.log(`✅ Created post for ${userPosts.username}`);
      }
    }

    // Create follow relationships
    console.log('\n👥 Creating follow relationships...');
    for (const relationship of followRelationships) {
      const follower = await User.findOne({ username: relationship.follower });
      const following = await User.findOne({ username: relationship.following });

      if (!follower || !following) {
        console.log(`⚠️  User not found for relationship ${relationship.follower} -> ${relationship.following}`);
        continue;
      }

      // Check if relationship already exists
      const existingFollow = await Follow.findOne({
        follower: follower._id,
        following: following._id
      });

      if (existingFollow) {
        console.log(`⚠️  Follow relationship already exists: ${relationship.follower} -> ${relationship.following}`);
        continue;
      }

      const newFollow = new Follow({
        follower: follower._id,
        following: following._id
      });

      await newFollow.save();
      console.log(`✅ ${relationship.follower} now follows ${relationship.following}`);
    }

    console.log('\n🎉 Content seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • Created posts for ${samplePosts.length} users`);
    console.log(`   • Created ${followRelationships.length} follow relationships`);
    console.log('   • Users now have sample content and connections');
    
  } catch (error) {
    console.error('❌ Error seeding content:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the seeding function
seedUserContent();