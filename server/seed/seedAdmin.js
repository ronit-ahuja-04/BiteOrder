require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const User = require('../models/User');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const email = (process.env.ADMIN_EMAIL || 'admin@biteorder.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';
  let admin = await User.findOne({ email });
  if (admin) console.log(`Admin already exists: ${email}`);
  else { await User.create({ name: 'BiteOrder Admin', email, password, role: 'admin' }); console.log(`Admin created: ${email}`); }
  await mongoose.disconnect();
})();
