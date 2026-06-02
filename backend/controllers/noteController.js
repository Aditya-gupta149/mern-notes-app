const Note = require("../models/Note");

const createNote = async (req, res) => {
    try {
        // Extract request data
        const { title, content } = req.body;

        // Validate required fields
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required",
            });
        }

        // Create note
        const note = await Note.create({
            user: req.user._id,
            title: title.trim(),
            content: content.trim(),
        });

        // Send response
        return res.status(201).json({
            success: true,
            message: "Note created successfully",
            note,
        });

    } catch (error) {
        console.error("Create Note Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const getNotes = async (req, res) => {
    try {
        // Fetch user notes
        const notes = await Note.find({
            user: req.user._id,
        }).sort({
            isPinned: -1,
            createdAt: -1,
        });

        // Send response
        return res.status(200).json({
            success: true,
            count: notes.length,
            notes,
        });

    } catch (error) {
        console.error("Get Notes Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const deleteNote = async (req, res) => {
    try {
        // Get note id
        const { id } = req.params;

        // Find note
        const note = await Note.findById(id);

        // Check note existence
        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found",
            });
        }

        // Verify ownership
        if (note.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this note",
            });
        }

        // Delete note
        await note.deleteOne();

        // Send response
        return res.status(200).json({
            success: true,
            message: "Note deleted successfully",
        });

    } catch (error) {
        console.error("Delete Note Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const updateNote = async (req, res) => {
    try {
        // Get note id
        const { id } = req.params;

        // Extract request data
        const { title, content, isPinned } = req.body;

        // Find note
        const note = await Note.findById(id);

        // Check note existence
        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found",
            });
        }

        // Verify ownership
        if (note.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this note",
            });
        }

        // Update title
        if (title !== undefined) {
            note.title = title.trim();
        }

        // Update content
        if (content !== undefined) {
            note.content = content.trim();
        }

        // Update pin status
        if (isPinned !== undefined) {
            note.isPinned = isPinned;
        }

        // Save changes
        const updatedNote = await note.save();

        // Send response
        return res.status(200).json({
            success: true,
            message: "Note updated successfully",
            note: updatedNote,
        });

    } catch (error) {
        console.error("Update Note Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

module.exports = { createNote, getNotes, deleteNote, updateNote}