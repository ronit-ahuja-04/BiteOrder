const User = require('../models/User');

// Runs on every server start: guarantees the admin account from .env exists and has the admin role.
// It never overwrites an existing admin's password, so changing it in the app/DB is safe.
const ensureAdmin = async () => {
  const email = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.log('ℹ️  ADMIN_EMAIL / ADMIN_PASSWORD not set in .env – skipping admin bootstrap.');
    return;
  }
  const existing = await User.findOne({ email });
  if (!existing) {
    await User.create({ name: process.env.ADMIN_NAME || 'BiteOrder Admin', email, password, role: 'admin' });
    console.log(`👑 Admin account created: ${email}`);
  } else if (existing.role !== 'admin') {
    existing.role = 'admin';
    await existing.save();
    console.log(`👑 ${email} promoted to admin`);
  } else {
    console.log(`👑 Admin account ready: ${email}`);
  }
};

module.exports = ensureAdmin;
