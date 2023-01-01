const express = require("express");
const router = express.Router();
const path = require("path");

const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const PROTO_PATH = path.join(__dirname, "../protos/post.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const PostService = grpc.loadPackageDefinition(packageDefinition).PostService;

const client = new PostService("localhost:50051", grpc.credentials.createInsecure());

// Create a post

router.post("/", (req, res) => {
    const { title, description, authorId } = req.body;

    if (!title || !description || !authorId) {
        return res.status(500).json({ msg: "Please enter all fields" });
    }

    const post = {
        title, description, authorId
    }

    client.createPost({ post }, (err, response) => {
        if (err) {
            console.log(err.details);
            return res.status(500).json({ success: false, msg: "could not create post" });
        }

        return res.status(200).json({ success: true, msg: "post created", id: response.id, post: response.post });
    });
});

// Get a post

router.get("/:id", (req, res) => {
    const { id } = req.params;

    client.getPost({ id }, (err, response) => {
        if (err) {
            console.log(err.details);
            return res.status(500).json({ success: false, msg: "could not get post" });
        }

        return res.status(200).json({ success: true, id: response.id, post: response.post });
    });
});

// Update a post

router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { title, description, authorId } = req.body;

    if (!title || !description || !authorId) {
        return res.status(500).json({ msg: "Please enter all fields" });
    }

    const post = {
        title, description, authorId
    }

    client.updatePost({ id, post }, (err, response) => {
        if (err) {
            console.log(err.details);
            return res.status(500).json({ success: false, msg: "could not update post" });
        }

        return res.status(200).json({ success: true, id: response.id, post: response.post });
    });
});

module.exports = router;