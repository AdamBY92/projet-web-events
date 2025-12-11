const express = require('express');
const router = express.Router();
const catCtrl = require('../controllers/categoryController');
const { auth, isAdmin } = require('../middleware/auth');

router.get('/', catCtrl.getCategories);
router.get('/:id', catCtrl.getCategoryById);

// Admin only
router.post('/', auth, isAdmin, catCtrl.createCategory);
router.put('/:id', auth, isAdmin, catCtrl.updateCategory);
router.delete('/:id', auth, isAdmin, catCtrl.deleteCategory);

module.exports = router;
