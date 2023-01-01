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

exports.requiresAuth = (req, res, next) => {

    const token = req.headers["authorization"].split(" ")[1];

    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    client.isAuthenticated({ token }, (err, response) => {
        if (err) {
            console.log(err.details);
            return res.status(500).json({ success: false, msg: "could not verify token" });
        }

        req.user = response.user;
        next();
    });
}