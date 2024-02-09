import pkg from 'lodash';
const { merge, get } = pkg;
import { getUserBySessionToken } from '../db/users.js';

export const isAuthenticated = async (req, res, next) => {
    try {
        const sessionToken = req.cookies['AUTH'];
        if (!sessionToken) {
            return res.sendStatus(403);
        }
        const existingUser = await getUserBySessionToken(sessionToken);
        if (!existingUser) {
            return res.sendStatus(403);
        }

        merge(req, { identity: existingUser });
        return next();
    } catch (e) {
        console.log(e);
        return res.sendStatus(400);
    }
}

export const isOwner = async (req, res, next) => {
    try {
        const { id } = req.params;
        const currentUserId = get(req, 'identity._id').toString();
        if (!currentUserId) {
            return res.sendStatus(403);
        }
        if (currentUserId !== id) {
            return res.sendStatus(403);
        }
        return next();
    } catch (e) {
        console.log(e);
        return res.sendStatus(400);
    }
}