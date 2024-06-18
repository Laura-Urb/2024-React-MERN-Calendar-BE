const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateJWT } = require('../helpers/jwt');

const createUser = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        ok: false,
        message: 'El usuario ya existe con ese correo',
      });
    }
    user = new User(req.body);
    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(user.password, salt);
    await user.save();
    // Generar nuestro JWT
    const token = await generateJWT(user.id, user.name);
    return res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Por favor hable con el administrador',
    });
  }
};

const loginUser = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        ok: false,
        message: 'El usuario no existe',
      });
    }
    // Confrimar la contraseña
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        message: 'La contraseña es incorrecta',
      });
    }
    // Generar nuestro JWT
    const token = await generateJWT(user.id, user.name);
    return res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Por favor hable con el administrador',
    });
  }
};

const revalidToken = async (req, res = response) => {
  const { uid, name } = req;
  // Generar JWT
  const token = await generateJWT(uid, name);
  res.json({
    ok: true,
    token,
  });
};

module.exports = {
  createUser,
  loginUser,
  revalidToken,
};
