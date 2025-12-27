const User = require('../models/User');

const register = async (username, password, role) => {
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
    role: role ? role.toUpperCase() : undefined
  });

  await newUser.save();
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

  if (profileData.full_name) user.full_name = profileData.full_name;
  if (profileData.phone_number) user.phone_number = profileData.phone_number;
  if (profileData.address) user.address = profileData.address;

  await user.save();
  return user;
};

module.exports = { register, login, updateProfile };