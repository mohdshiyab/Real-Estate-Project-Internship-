// Property controller — full CRUD + search
const Property = require("../models/Property");

// GET /api/properties?q=...&type=...&status=...&minPrice=...&maxPrice=...&bedrooms=...
exports.getAll = async (req, res, next) => {
  try {
    const { q, type, status, minPrice, maxPrice, bedrooms } = req.query;
    const filter = {};
    if (q) {
      const rx = new RegExp(q, "i");
      filter.$or = [{ title: rx }, { location: rx }, { description: rx }];
    }
    if (type) filter.propertyType = type;
    if (status) filter.status = status;
    if (bedrooms) filter.bedrooms = { $gte: Number(bedrooms) };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    const items = await Property.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
};

// GET /api/properties/:id
exports.getOne = async (req, res, next) => {
  try {
    const item = await Property.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Property not found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

// POST /api/properties
exports.create = async (req, res, next) => {
  try {
    const created = await Property.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

// PUT /api/properties/:id
exports.update = async (req, res, next) => {
  try {
    const updated = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Property not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/properties/:id
exports.remove = async (req, res, next) => {
  try {
    const deleted = await Property.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Property not found" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};
