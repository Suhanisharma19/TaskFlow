require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Project = require('../src/models/Project');

const createDefaultUsers = async () => {
  const defaultAdmin = {
    name: 'TaskFlow Admin',
    email: 'admin@taskflow.local',
    password: 'Admin@12345',
    role: 'admin'
  };

  const memberSeeds = [
    {
      name: 'Alex Member',
      email: 'alex.member@taskflow.local',
      password: 'Member@12345',
      role: 'member'
    },
    {
      name: 'Priya Member',
      email: 'priya.member@taskflow.local',
      password: 'Member@12345',
      role: 'member'
    }
  ];

  let admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    admin = await User.create(defaultAdmin);
    console.log('Created default admin user.');
  }

  for (const memberSeed of memberSeeds) {
    const existingMember = await User.findOne({ email: memberSeed.email });
    if (!existingMember) {
      await User.create(memberSeed);
      console.log(`Created member: ${memberSeed.email}`);
    }
  }

  const members = await User.find({ role: 'member' }).select('_id');
  return { admin, members };
};

const createDefaultProjectIfMissing = async (adminId, memberIds) => {
  const hasProject = await Project.exists({});
  if (hasProject) {
    console.log('Projects already exist, skipping project seed.');
    return;
  }

  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 30);

  const project = await Project.create({
    name: 'Sample Onboarding Project',
    description: 'Seeded project to validate task assignment and modal dropdowns.',
    deadline,
    priority: 'medium',
    status: 'active',
    teamMembers: memberIds,
    createdBy: adminId
  });

  await User.updateMany(
    { _id: { $in: memberIds } },
    { $addToSet: { assignedProjects: project._id } }
  );

  console.log('Created sample project.');
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const { admin, members } = await createDefaultUsers();
    await createDefaultProjectIfMissing(admin._id, members.map((member) => member._id));
    console.log('Seed complete.');
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
