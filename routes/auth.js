/* 
    Rutas de Usuarios / Auth
    host + /api/auth

 */

const { Router } = require('express');
const { createUser, loginUser, revalidToken } = require('../controller/auth');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');
const router = Router();

router.post(
  '/new',
  [
    //middleware
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña debe de ser de 6 caracteres').isLength({ min: 6 }),
    validateFields,
  ],
  createUser
);
router.post(
  '/',
  [
    //middleware
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña debe de ser de 6 caracteres').isLength({ min: 6 }),
    validateFields,
  ],
  loginUser
);
router.get('/renew', validateJWT, revalidToken);

module.exports = router;
