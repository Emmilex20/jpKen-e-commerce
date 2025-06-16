// apps/server/seeder.js
import dotenv from 'dotenv';
import users from './data/users.js'; // Assuming you have a users.js too for dummy users (optional for now)
import products from './data/products.js';
import User from './src/models/User.js';
import Product from './src/models/Product.js';
import Order from './src/models/Order.js';
import connectDB from './src/config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);

    const adminUser = createdUsers[0]._id; // Assumes the first user in users.js is admin

    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    await Product.insertMany(sampleProducts);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

// This allows us to run the script with specific arguments
// e.g., node seeder.js -d to destroy data
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}