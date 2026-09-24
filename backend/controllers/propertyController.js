// Property controller — full CRUD + search + seller ownership + sorting
const Property = require("../models/Property");

// GET /api/properties?q=...&type=...&status=...&minPrice=...&maxPrice=...&bedrooms=...&sort=...
exports.getAll = async (req, res, next) => {
  try {
    const { q, type, category, status, minPrice, maxPrice, bedrooms, location, sort } = req.query;
    const filter = {};

    if (q) {
      const rx = new RegExp(q, "i");
      filter.$or = [{ title: rx }, { location: rx }, { description: rx }];
    }
    if (category) filter.estateCategory = category;
    if (type) filter.propertyType = type;
    if (status) filter.status = status;
    if (bedrooms) filter.bedrooms = { $gte: Number(bedrooms) };
    if (location) filter.location = new RegExp(location, "i");
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price-asc") {
      sortOption = { price: 1 };
    } else if (sort === "price-desc") {
      sortOption = { price: -1 };
    } else if (sort === "beds-desc") {
      sortOption = { bedrooms: -1 };
    }

    const items = await Property.find(filter)
      .populate("owner", "name email phone agency")
      .sort(sortOption);

    res.json(items);
  } catch (err) {
    next(err);
  }
};

// GET /api/properties/my-listings
// Returns only the properties listed by the logged-in seller
exports.getMyListings = async (req, res, next) => {
  try {
    const items = await Property.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
};

// GET /api/properties/:id
exports.getOne = async (req, res, next) => {
  try {
    const item = await Property.findById(req.params.id).populate(
      "owner",
      "name email phone agency"
    );
    if (!item) return res.status(404).json({ message: "Property not found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

// POST /api/properties
// Restricted to authenticated sellers
exports.create = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      owner: req.user._id,
      contactNumber: req.body.contactNumber || req.user.phone || "",
    };

    const created = await Property.create(data);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

// PUT /api/properties/:id
// Only property owner can update
exports.update = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    // Check ownership if property has an owner
    if (property.owner && property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to modify this property" });
    }

    const updated = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/properties/:id
// Only property owner can delete
exports.remove = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    // Check ownership if property has an owner
    if (property.owner && property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this property" });
    }

    await Property.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};
