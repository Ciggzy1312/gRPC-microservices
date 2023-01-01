const PROTO_PATH = __dirname + '/protos/post.proto';
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { createServer } = require('./grpc');
const { createPost, getPost, updatePost } = require('./service');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const post_proto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();
createServer(server);

server.addService(post_proto.PostService.service, {
    createPost,
    getPost,
    updatePost
});