// apps/server/data/users.js
import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    // Password will be hashed by Mongoose pre-save hook
    password: '123456',
    isAdmin: true,
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: '123456',
    isAdmin: false,
  },
  {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: '123456',
    isAdmin: false,
  },
];

export default users;