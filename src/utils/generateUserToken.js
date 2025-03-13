import jwt from "jsonwebtoken";

export const generateToken = (user) => {
    const secret = process.env.SESSION_SECRET;
    if (!secret) {
        throw new Error("SESSION_SECRET environment variable is not defined");
    }

    return jwt.sign({ id: user._id, email: user.email }, secret, {
        expiresIn: '7d',
    });
};
