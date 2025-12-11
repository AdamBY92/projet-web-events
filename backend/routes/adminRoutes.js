const { Router } = require("express");
const AdminController = require("../controllers/adminController");
const checkAuth = require("../middlwares/auth");
const checkRole = require("../middlwares/check-role");

const router = Router();

// GET /api/admin/stats - Statistiques admin
router.get("/admin/stats", checkAuth, checkRole(["admin"]), AdminController.stats);

module.exports = router;