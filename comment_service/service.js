const PrismaClient = require('@prisma/client').PrismaClient

const prisma = new PrismaClient()

exports.createComment = async (call, callback) => {
    const { content, authorId, postId } = call.request.comment

    try {
        const comment = await prisma.comment.create({
            data: {
                content,
                authorId,
                postId
            }
        })

        callback(null, { id: comment.id, comment })
    } catch (error) {
        callback(error, null)
    }

}

exports.getComment = async (call, callback) => {
    const { id } = call.request

    try {
        const comment = await prisma.comment.findUnique({
            where: {
                id
            }
        })

        callback(null, { id: comment.id, comment })
    } catch (error) {
        callback(error, null)
    }
}

exports.updateComment = async (call, callback) => {
    const { id } = call.request
    const { content, authorId, postId } = call.request.comment

    try {
        const existingComment = await prisma.comment.findUnique({
            where: {
                id
            }
        })

        if (!existingComment) {
            return callback({ details: 'Comment not found' }, null)
        }

        if (existingComment.authorId !== authorId) {
            return callback({ details: 'Can only update your comment' }, null)
        }

        const comment = await prisma.comment.update({
            where: {
                id
            },
            data: {
                content
            }
        })

        callback(null, { id: comment.id, comment })
    } catch (error) {
        callback(error, null)
    }
}

exports.deleteComment = async (call, callback) => {
    const { id } = call.request

    try {
        const comment = await prisma.comment.findUnique({
            where: {
                id
            }
        });

        if (!comment) {
            return callback({ details: 'Comment not found' }, null)
        }

        if (comment.authorId !== authorId) {
            return callback({ details: 'Can only delete your comment' }, null)
        }

        await prisma.comment.delete({
            where: {
                id
            }
        });

        callback(null, { comment })
    } catch (error) {
        callback(error, null)
    }
}