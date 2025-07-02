import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Admin from './models/Admin.js';

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const existingAdmin = await Admin.findOne({ email: 'admin@gmail.com' });

  if (existingAdmin) {
    console.log('Admin already exists!');
  } else {
    const admin = new Admin({
      email: 'admin@gmail.com',
      password: 'admin123',
    });

    await admin.save();
    console.log('Admin created!');
  }

  mongoose.disconnect();
});
