// Creates a sample customer account for reviewers/demos:  npm run seed:demo
require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const User = require('../models/User');

const DEMO = { name: 'Demo Customer', email: 'demo.user@biteorder.com', password: 'Demo@1234' };

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  if (await User.findOne({ email: DEMO.email })) console.log(`Demo user already exists: ${DEMO.email}`);
  else { await User.create({ ...DEMO, role: 'customer' }); console.log(`Demo user created: ${DEMO.email} / ${DEMO.password}`); }
  await mongoose.disconnect();
})();
