const PrismaClient = require('@prisma/client').PrismaClient

const prisma = new PrismaClient()

exports.createPost = async (call, callback) => {
    const { title, description, authorId } = call.request.post;

    try {
        const post = await prisma.post.create({
            data: {
                title,
                description,
                authorId
            }
        });

        callback(null, { id: post.id, post });
    } catch (error) {
        callback(error, null);
    }

}

exports.getPost = async (call, callback) => {
    const { id } = call.request;

    try {
        const post = await prisma.post.findUnique({
            where: {
                id
            }
        });

        callback(null, { id: post.id, post });
    } catch (error) {
        callback(error, null);
    }
}

exports.updatePost = async (call, callback) => {
    const { id } = call.request;
    const { title, description, authorId } = call.request.post;

    try {
        const existingPost = await prisma.post.findUnique({
            where: {
                id
            }
        });

        if (!existingPost) {
            return callback({ details: "Post not found" }, null);
        }

        if (existingPost.authorId !== authorId) {
            return callback({ details: "Can only update your post" }, null);
        }

        const post = await prisma.post.update({
            where: {
                id
            },
            data: {
                title,
                description
            }
        });

        callback(null, { id: post.id, post });
    } catch (error) {
        callback(error, null);
    }
}