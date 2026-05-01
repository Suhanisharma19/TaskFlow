require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB\n');
    
    const users = await User.find({}, 'name email role status');
    
    console.log('Users in database:');
    console.log('='.repeat(80));
    
    if (users.length === 0) {
      console.log('No users found. Sign up to create an account!');
    } else {
      users.forEach((u, i) => {
        console.log(`${i + 1}. Name: ${u.name}`);
        console.log(`   Email: ${u.email}`);
        console.log(`   Role: ${u.role}`);
        console.log(`   Status: ${u.status || 'active'}`);
        console.log('-'.repeat(80));
      });
    }
    
    console.log('\n');
    process.exit();
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
