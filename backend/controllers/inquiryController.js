const Inquiry = require("../models/Inquiry");
const Property = require("../models/Property");

// @desc    Express interest / submit inquiry on a property
// @route   POST /api/inquiries
// @access  Private (Buyer)
exports.createInquiry = async (req, res, next) => {
  try {
    const { propertyId, message, phone } = req.body;

    if (!propertyId) {
      return res.status(400).json({ message: "Property ID is required" });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Determine seller: if property has an owner, use it; otherwise, fallback to first seller or property itself
    const sellerId = property.owner || null;

    const inquiry = await Inquiry.create({
      property: property._id,
      seller: sellerId || req.user._id, // fallback in case unowned demo listing
      buyer: req.user._id,
      buyerName: req.user.name,
      buyerEmail: req.user.email,
      buyerPhone: phone || req.user.phone || "",
      message: message || "I am interested in this residence and would like to arrange a viewing.",
    });

    const populated = await Inquiry.findById(inquiry._id).populate(
      "property",
      "title price location image propertyType status"
    );

    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

// @desc    Get all inquiries for the logged-in seller
// @route   GET /api/inquiries/seller
// @access  Private (Seller)
exports.getSellerInquiries = async (req, res, next) => {
  try {
    // Also include inquiries for properties owned by this seller
    const myProperties = await Property.find({ owner: req.user._id }).select("_id");
    const propertyIds = myProperties.map((p) => p._id);

    const inquiries = await Inquiry.find({
      $or: [{ seller: req.user._id }, { property: { $in: propertyIds } }],
    })
      .populate("property", "title price location image propertyType status")
      .populate("buyer", "name email phone")
      .sort({ createdAt: -1 });

    res.json(inquiries);
  } catch (err) {
    next(err);
  }
};

// @desc    Get all inquiries made by the logged-in buyer
// @route   GET /api/inquiries/buyer
// @access  Private (Buyer)
exports.getBuyerInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find({ buyer: req.user._id })
      .populate("property", "title price location image propertyType status contactNumber")
      .populate("seller", "name email phone agency")
      .sort({ createdAt: -1 });

    res.json(inquiries);
  } catch (err) {
    next(err);
  }
};

// @desc    Update inquiry status (e.g. mark contacted)
// @route   PATCH /api/inquiries/:id/status
// @access  Private (Seller)
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    inquiry.status = status || inquiry.status;
    await inquiry.save();

    res.json(inquiry);
  } catch (err) {
    next(err);
  }
};
