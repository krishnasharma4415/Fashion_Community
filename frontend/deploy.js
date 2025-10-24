#!/usr/bin/env node

// Deployment script for Vercel
console.log('🚀 Preparing for deployment...');

// Set production environment
process.env.NODE_ENV = 'production';
process.env.VITE_API_URL = 'https://fashion-community-backend.onrender.com';

console.log('✅ Environment variables set:');
console.log('   NODE_ENV:', process.env.NODE_ENV);
console.log('   VITE_API_URL:', process.env.VITE_API_URL);

console.log('🏗️  Building application...');
console.log('Run: npm run build');
console.log('📦 Ready for deployment to Vercel!');