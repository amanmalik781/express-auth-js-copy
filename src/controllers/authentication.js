import { getUserByEmail, createUser } from '../db/users.js';
import { random, authentication } from '../helpers/index.js'

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
        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password)
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
        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
        if (!user) { // user doesn't exists then we cannot login
            return res.sendStatus(400);
        }
        console.log(user);
        const expectedHash = authentication(user.authentication.salt, password);
        if (user.authentication.password !== expectedHash) {
            return res.sendStatus(403);
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());
        await user.save();
        res.cookie('AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/' });

        return res.status(200).json(user).end();
    } catch (error) {
        console.log('login controller error', error);
        return res.sendStatus(400);
    }
}