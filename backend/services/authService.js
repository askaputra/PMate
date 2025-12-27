const User = require('../models/User');

const register = async (username, password, role, personalData = {}) => {
  if (!username || !password) {
    throw new Error("Username dan Password wajib diisi!");
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error("Username sudah terpakai!");
  }

  const newUser = new User({
    username,
    password,
    role: role ? role.toUpperCase() : undefined,
    full_name: personalData.full_name,
    phone_number: personalData.phone_number,
    address: personalData.address
  });
  console.log("NEW USER OBJECT BEFORE SAVE:", newUser);

  await newUser.save();
  console.log("NEW USER OBJECT AFTER SAVE:", newUser);
  return newUser;
};

const login = async (username, password) => {
  const user = await User.findOne({ username, password });
  if (!user) {
    throw new Error("Username atau Password salah!");
  }
  return user;
};

const updateProfile = async (id, profileData) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error("User tidak ditemukan!");
  }

  if (profileData.full_name !== undefined) user.full_name = profileData.full_name;
  if (profileData.phone_number !== undefined) user.phone_number = profileData.phone_number;
  if (profileData.address !== undefined) user.address = profileData.address;

  console.log("USER OBJECT BEFORE SAVE (Update):", user);
  await user.save();
  console.log("USER OBJECT AFTER SAVE (Update):", user);
  return user;
};

module.exports = { register, login, updateProfile };