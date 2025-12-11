const { Router } = require("express");
const RegistrationController = require("../controllers/registrationController");
const checkAuth = require("../middlwares/auth");
const checkRole = require("../middlwares/check-role");

const router = Router();

// GET /api/registrations - Récupérer les inscriptions de l'utilisateur
router.get("/registrations", checkAuth, checkRole(["user", "admin"]), RegistrationController.cget);

// POST /api/registrations - S'inscrire à un événement
router.post("/registrations", checkAuth, checkRole(["user", "admin"]), RegistrationController.create);

// DELETE /api/registrations/:id - Annuler une inscription
router.delete("/registrations/:id", checkAuth, checkRole(["user", "admin"]), RegistrationController.delete);

module.exports = router;