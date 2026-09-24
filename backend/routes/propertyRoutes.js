// REST routes for properties with seller authentication
const router = require("express").Router();
const c = require("../controllers/propertyController");
const { protect, authorizeRoles } = require("../middleware/auth");

router.get("/", c.getAll);
router.get("/my-listings", protect, authorizeRoles("seller", "dealer"), c.getMyListings);
router.get("/:id", c.getOne);

// Protected seller actions
router.post("/", protect, authorizeRoles("seller", "dealer"), c.create);
router.put("/:id", protect, authorizeRoles("seller", "dealer"), c.update);
router.delete("/:id", protect, authorizeRoles("seller", "dealer"), c.remove);

module.exports = router;
