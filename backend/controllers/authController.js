const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const newUser = await authService.register(username, password, role);
    console.log(`User baru terdaftar: ${newUser.username} (${newUser.role})`);
    res.json({ message: "Registrasi berhasil, silakan login.", user: { username: newUser.username, role: newUser.role } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await authService.login(username, password);
    res.json({ id: user._id, username: user.username, role: user.role, full_name: user.full_name, phone_number: user.phone_number, address: user.address });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { full_name, phone_number, address } = req.body;
    const updatedUser = await authService.updateProfile(req.params.id, { full_name, phone_number, address });
    res.json({
      message: "Profil berhasil diperbarui.",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        role: updatedUser.role,
        full_name: updatedUser.full_name,
        phone_number: updatedUser.phone_number,
        address: updatedUser.address
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { register, login, updateProfile };