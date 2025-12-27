const authService = require('../services/authService');

const register = (req, res) => {
  try {
    const { username, password, role } = req.body;
    const newUser = authService.register(username, password, role);
    console.log(`User baru terdaftar: ${newUser.username} (${newUser.role})`);
    res.json({ message: "Registrasi berhasil, silakan login.", user: { username: newUser.username, role: newUser.role } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = (req, res) => {
  try {
    const { username, password } = req.body;
    const user = authService.login(username, password);
    res.json({ id: user.id, username: user.username, role: user.role });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = { register, login };