const { query } = require("../database/Db");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Register = async (req, res) => {
  const { name, email, password } = req.body;
  if(!email || !password || !name ) {
    return res.status(403).json({ pesan: 'Gagal melakukan register' });
  }
  try {
    const emailExists = await query("SELECT * FROM users WHERE email = ?", [email]);
    if (emailExists.length > 0) {
      return res.status(400).json({ pesan: "Email sudah terdaftar" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await query("INSERT INTO users SET ?", user);

    const accessToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('accessToken', accessToken, { httpOnly: true });

    return res.status(200).json({
      pesan: "Register berhasil",
      name: user.name,
      email: user.email,
      accessToken: accessToken
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      pesan: "Terjadi kesalahan saat registrasi",
    });
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;
  if(!email || !password ) {
    return res.status(403).json({ pesan: 'Gagal melakukan login' });
  }
  try {
    const userData = await query("SELECT * FROM users WHERE email = ?", [email]);
    if (userData.length === 0) {
      return res.status(400).json({ pesan: "Email atau kata sandi salah" });
    }
    const isPasswordValid = await bcrypt.compare(password, userData[0].password);
    if (!isPasswordValid) {
      return res.status(400).json({ pesan: "Email atau kata sandi salah" });
    }

    const accessToken = jwt.sign({ email: userData[0].email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ email: userData[0].email }, process.env.JWT_SECRET, { expiresIn: '1d' });

    await query("UPDATE users SET refresh_token = ? WHERE email = ?", [refreshToken, email]);

    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });

    return res.status(200).json({
      pesan: "Login berhasil",
      data: {
        name: userData[0].name,
        email: userData[0].email,
        accessToken: accessToken,
        refreshToken: refreshToken
      },
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      pesan: "Terjadi kesalahan saat login",
    });
  }
};

module.exports = {
  Register,
  Login
};
