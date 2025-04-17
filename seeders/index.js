require('dotenv').config();
const mongoose     = require('mongoose');
const Role         = require('../models/roleModel');
const User         = require('../models/userModel');
const { roles }    = require('./data/role.seed');
const { users }    = require('./data/superadmin.seed');
const hashPassword = require('../utils/jwt');

async function runSeeder() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('🌱 Connected to MongoDB');

  // Clear
  await mongoose.connection.db.dropCollection('roles').catch(() => {});
  await mongoose.connection.db.dropCollection('users').catch(() => {});
  console.log('🗑️ Cleared collections');

  // Seed roles
  const insertedRoles = await Role.insertMany(roles);
  console.log('✅ Roles:', insertedRoles.map(r => r.name).join(', '));

  // Map role names → IDs
  const roleMap = insertedRoles.reduce((map, r) => {
    map[r.name] = r._id;
    return map;
  }, {});

  // Prepare users (hash passwords & attach role_id)
  const usersToInsert = await Promise.all(
    users.map(async u => ({
      name:     u.name,
      email:    u.email,
      password: await hashPassword(u.password),
      role_id:  roleMap[u.roleName],
    }))
  );
  const insertedUsers = await User.insertMany(usersToInsert);
  console.log('✅ Users:', insertedUsers.map(u => u.email).join(', '));

  await mongoose.disconnect();
  console.log('🌱 Seeder finished, disconnected');
}

runSeeder().catch(err => {
  console.error('Seeder error:', err);
  process.exit(1);
});
