// backend/api/campaignRoutes.js
const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');

//  لاحقًا إضافة middleware للتحقق من الصلاحيات (isAdmin)
// const auth = require('../middleware/auth');
// const adminOnly = require('../middleware/adminOnly');

router.get('/', campaignController.getAllCampaigns);
router.get('/:id', campaignController.getCampaignById);
router.post('/', /* auth, adminOnly, */ campaignController.createCampaign);
router.put('/:id', /* auth, adminOnly, */ campaignController.updateCampaign);
router.delete('/:id', /* auth, adminOnly, */ campaignController.deleteCampaign);

module.exports = router;