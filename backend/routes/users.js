const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.get("/", async (req, res) => {
  const user = new User();

  res.json(
    await user.list()
  );
});

// New DELETE method to delete a user by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = new User();
    const { body } = await user.delete(id);
    res.json({ message: "User deleted successfully", result: body });
  } catch (error) {
    console.error("Error deleting user:", error);
    if (error.meta && error.meta.statusCode === 404) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

module.exports = router;
