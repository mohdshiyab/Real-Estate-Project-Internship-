const router = require("express").Router();
const {
  createInquiry,
  getSellerInquiries,
  getBuyerInquiries,
  updateStatus,
} = require("../controllers/inquiryController");
const { protect, authorizeRoles } = require("../middleware/auth");

// Buyer creates an inquiry
router.post("/", protect, createInquiry);

// Seller views inquiries for their listed properties
router.get("/seller", protect, authorizeRoles("seller", "dealer"), getSellerInquiries);

// Buyer views their own submitted inquiries
router.get("/buyer", protect, getBuyerInquiries);

// Seller updates inquiry status
router.patch("/:id/status", protect, authorizeRoles("seller", "dealer"), updateStatus);

module.exports = router;
