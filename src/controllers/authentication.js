import JWT from 'jsonwebtoken';
import { getUserByEmail, createUser } from '../db/users.js';
import { generateSalt, generateHashedPassword } from '../helpers/index.js'

export const register = async (req, res) => {
    try {
        const { email, password, username } = req.body;
        if (!email || !password || !username) {
            return res.sendStatus(400);
        }
        const existingUser = await getUserByEmail(email);
        if (existingUser) { // user already exists so cannot create again
            return res.sendStatus(400);
        }
        // if not then we go ahead and create one
        const salt = generateSalt();
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: generateHashedPassword(salt, password)
            }
        });
        return res.status(200).json(user).end();
    } catch (error) {
        console.log('register controller error', error);
        return res.sendStatus(400);
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.sendStatus(400);
        }
        const user = await getUserByEmail(email).select({
            authentication: {
                salt: 1,
                password: 1
            }
        });
        if (!user) { // user doesn't exists then we cannot login
            return res.sendStatus(400);
        }
        const expectedHash = generateHashedPassword(user.authentication.salt, password);
        if (user.authentication.password !== expectedHash) {
            return res.sendStatus(403);
        }
        // payload to create JWT token
        const payload = {
            id: user._id,
            username: user.username,
            email: user.email
        };
        // JWT token
        const token = JWT.sign(payload, process.env.SECRET);
        user.authentication.sessionToken = token;
        await user.save();
        res.cookie('token', user.authentication.sessionToken);
        return res.status(200).json(user).end();
    } catch (error) {
        console.log('login controller error', error);
        return res.sendStatus(400);
    }
}

export const logout = (req, res) => {
    try {
        return res.clearCookie("token").sendStatus(200);
    } catch (e) {
        console.log(e.message);
    }

};