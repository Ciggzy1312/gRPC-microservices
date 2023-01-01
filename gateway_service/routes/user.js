const express = require("express");
const router = express.Router();
const path = require("path");

const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const PROTO_PATH = path.join(__dirname, "../protos/user.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const UserService = grpc.loadPackageDefinition(packageDefinition).UserService;

const client = new UserService("localhost:50050", grpc.credentials.createInsecure());

// Register a user

router.post("/register", (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ msg: "Please enter all fields" });
    }

    const user = {
        username, email, password
    }

    client.createUser({ user }, (err, response) => {
        if (err) {
            console.log(err.details);
            return res.status(500).json({ success: false, msg: "could not register user" });
        }

        return res.status(200).json({ success: true, msg: "user registered", id: response.id, user: response.user });
    });
});

// Login a user

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: "Please enter all fields" });
    }

    const user = {
        email, password
    }

    client.createToken({ user }, (err, response) => {
        if (err) {
            console.log(err.details);
            return res.status(500).json({ success: false, msg: "could not login user" });
        }

        return res.status(200).json({ success: true, msg: "user logged in", id: response.id, user: response.user, token: response.token });
    });
});

// Get a user

router.get("/:id", requiresAuth, (req, res) => {
    const { id } = req.params;

    client.getUser({ id }, (err, response) => {
        if (err) {
            console.log(err.details);
            return res.status(500).json({ success: false, msg: "user not found or doesn't exist" });
        }

        return res.status(200).json({ success: true, id: response.id, user: response.user });
    });
});

module.exports = router;