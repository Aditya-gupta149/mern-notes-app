const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { createNote,getNotes,deleteNote,updateNote } = require("../controllers/noteController");



const router = express.Router();
router.use(protect)

router.post("/", createNote);
router.get("/", getNotes);
router.delete("/:id", deleteNote);
router.put("/:id", updateNote);

module.exports = router;