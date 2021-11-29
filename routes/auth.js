var express = require('express');
var router = express.Router();
var auth = require("../controllers/LoginController");

const { route } = require(".");
router.get('/logout', auth.Logout);
router.get('/login', auth.getLogin);
router.post('/login', auth.Login);
router.get('/signup', auth.SignUp);
router.post('/register', auth.Register);
router.get('/register', auth.getRegister);
module.exports = router;
