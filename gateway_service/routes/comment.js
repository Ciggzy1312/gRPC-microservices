const express = require("express");
const router = express.Router();
const path = require("path");

const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const { requiresAuth } = require("../middleware/auth");
const PROTO_PATH = path.join(__dirname, "../protos/comment.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const CommentService = grpc.loadPackageDefinition(packageDefinition).CommentService;

const client = new CommentService("localhost:50052", grpc.credentials.createInsecure());

// Create a comment

router.post("/", requiresAuth, (req, res) => {
    const { content, authorId, postId } = req.body;

    if (!content || !authorId || !postId) {
        return res.status(500).json({ msg: "Please enter all fields" });
    }

    const comment = {
        content, authorId, postId
    }

    client.createComment({ comment }, (err, response) => {
        if (err) {
            console.log(err.details);
            return res.status(500).json({ success: false, msg: "could not create comment" });
        }

        return res.status(200).json({ success: true, msg: "comment created", id: response.id, comment: response.comment });
    });
});

// Get a comment

router.get("/:id", requiresAuth, (req, res) => {
    const { id } = req.params;

    client.getComment({ id }, (err, response) => {
        if (err) {
            console.log(err.details);
            return res.status(500).json({ success: false, msg: "could not get comment" });
        }

        return res.status(200).json({ success: true, id: response.id, comment: response.comment });
    });
});

// Update a comment

router.put("/:id", requiresAuth, (req, res) => {
    const { id } = req.params;
    const { content, authorId, postId } = req.body;

    if (!content || !authorId || !postId) {
        return res.status(500).json({ msg: "Please enter all fields" });
    }

    const comment = {
        content, authorId, postId
    }

    client.updateComment({ id, comment }, (err, response) => {
        if (err) {
            console.log(err.details);
            return res.status(500).json({ success: false, msg: "could not update comment" });
        }

        return res.status(200).json({ success: true, msg: "comment updated", id: response.id, comment: response.comment });
    });
});

// Delete a comment

router.delete("/:id", requiresAuth, (req, res) => {
    const { id } = req.params;

    client.deleteComment({ id }, (err, response) => {
        if (err) {
            console.log(err.details);
            return res.status(500).json({ success: false, msg: "could not delete comment" });
        }

        return res.status(200).json({ success: true, msg: "comment deleted", comment: response.comment });
    });
});

module.exports = router;