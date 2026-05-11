// REST routes for properties
const router = require("express").Router();
const c = require("../controllers/propertyController");

router.get("/", c.getAll);
router.get("/:id", c.getOne);
router.post("/", c.create);
router.put("/:id", c.update);
router.delete("/:id", c.remove);

module.exports = router;
