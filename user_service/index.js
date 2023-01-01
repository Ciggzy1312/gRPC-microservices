const PROTO_PATH = __dirname + '/protos/user.proto';
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { createServer } = require('./grpc');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const user_proto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();
createServer(server);

server.addService(user_proto.UserService.service, {
    // Add services here
});