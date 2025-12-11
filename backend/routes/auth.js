const { Router } = require("express");
const { register, login } = require('../controllers/authController-avec-mongo');

const router = Router();

// POST /api/auth/register
router.post("/auth/register", register);

// POST /api/auth/login
router.post("/auth/login", login);

module.exports = router;