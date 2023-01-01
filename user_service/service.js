const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const PrismaClient = require('@prisma/client').PrismaClient

const prisma = new PrismaClient()

exports.createUser = async (call, callback) => {
    const { username, email, password } = call.request.user;

    const hashPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashPassword
            }
        });

        callback(null, { id: user.id, user });
    } catch (error) {
        callback(error, null);
    }
}

exports.getUser = async (call, callback) => {
    const { id } = call.request;

    try {
        const user = await prisma.user.findUnique({
            where: {
                id
            }
        });

        callback(null, { id, user });
    } catch (error) {
        callback(error, null);
    }
}

exports.createToken = async (call, callback) => {
    const { email, password } = call.request.user;

    const existingUser = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (!existingUser) {
        return callback(new Error("User not found"), null);
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
        return callback(new Error("Invalid password"), null);
    }

    jwt.sign(user, "secret", (err, token) => {
        if (err) {
            return callback(err, null);
        }

        callback(null, { id: existingUser.id, user: existingUser, token });
    });
}

exports.isAuthenticated = async (call, callback) => {
    const { token } = call.request;

    jwt.verify(token, "secret", (err, user) => {
        if (err) {
            return callback(err, { authenticated: false });
        }

        const response = {
            user,
            authenticated: true
        }

        callback(null, response);
    });
}