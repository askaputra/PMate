const db = require('../data');

const register = (username, password, role) => {
  if (!username || !password || !role) {
    throw new Error("Semua kolom wajib diisi!");
  }
  const existingUser = db.users.find(u => u.username === username);
  if (existingUser) {
    throw new Error("Username sudah terpakai!");
  }
  
  const newUser = {
    id: db.counters.userId++,
    username,
    password, 
    role: role.toUpperCase()
  };
  db.users.push(newUser);
  return newUser;
};

const login = (username, password) => {
  const user = db.users.find(u => u.username === username && u.password === password);
  if (!user) {
    throw new Error("Username atau Password salah!");
  }
  return user;
};

module.exports = { register, login };