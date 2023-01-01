const grpc = require("@grpc/grpc-js");

exports.createServer = (server) => {
    server.bindAsync(
        "127.0.0.1:50051", grpc.ServerCredentials.createInsecure(), (err, port) => {

            if (err) {
                console.log("Error binding server", err);
                return;
            }

            server.start();
            console.log("Server started on port: ", port);
        }
    )
}