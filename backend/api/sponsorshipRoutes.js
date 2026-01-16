//backend/api/sponsorshipRoutes.js
const express = require("express");
const { body } = require("express-validator");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/authMiddleware");

const {
  createSponsorship,
  getAllSponsorships,
  getSponsorshipById,
  processSponsorshipPayment,
  updateSponsorship,
  deleteSponsorship,
} = require("../controllers/sponsorshipController");

const router = express.Router();

const createSponsorshipValidation = [
  body("donationRequestId")
    .notEmpty()
    .withMessage("معرّف الطلب مطلوب")
    .isMongoId()
    .withMessage("معرّف الطلب يجب أن يكون ObjectId صالح"),
  body("shortDescription")
    .trim()
    .notEmpty()
    .withMessage("الوصف المبسط مطلوب")
    .isLength({ max: 500 })
    .withMessage("الوصف لا يمكن أن يتجاوز 500 حرف"),
];

// GET all sponsorships
router.get(
  "/",
  (req, res, next) => {
    req.selectFields =
      "caseId firstName city type amountPerPeriod periodLabel durationLabel " +
      "shortDescription urgencyLevel totalPeriods paidPeriods status sponsorId createdAt";
    next();
  },
  getAllSponsorships
);

// GET single sponsorship by ID
router.get(
  "/:id",
  (req, res, next) => {
    req.selectFields =
      "caseId firstName city type amountPerPeriod periodLabel durationLabel " +
      "shortDescription urgencyLevel totalPeriods paidPeriods status sponsorId createdAt";
    next();
  },
  getSponsorshipById
);

// POST (create new sponsorship)
router.post(
  "/",
  protect,
  authorize("admin"),
  createSponsorshipValidation,
  createSponsorship
);

// PUT (update sponsorship) — admin only
router.put('/:id', protect, authorize('admin'), updateSponsorship);

// DELETE (delete sponsorship) — admin only
router.delete('/:id', protect, authorize('admin'), deleteSponsorship);

// POST payment processing
router.post(
  "/payment",
  protect,
  processSponsorshipPayment
);

module.exports = router;