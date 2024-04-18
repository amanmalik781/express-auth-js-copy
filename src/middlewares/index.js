import pkg from 'lodash';
import JWT from 'jsonwebtoken';
const { merge, get } = pkg;
import { getUserBySessionToken } from '../db/users.js';

export const isAuthenticated = async (req, res, next) => {
    try {
        const sessionToken = req.cookies['token'];
        if (!sessionToken) {
            return res.sendStatus(403);
        }
        // const user = await getUserBySessionToken(sessionToken);
        // if (!user) {
        //     return res.sendStatus(403);
        // }
        const payload = JWT.verify(sessionToken, process.env.SECRET);
        console.log('isAuthenticated payload', payload);
        if (payload?.id === req.params.id) {
            // merge(req, { identity: user });
            return next();
        }
        return res.sendStatus(403);
    } catch (e) {
        console.log(e);
        return res.sendStatus(400);
    }
}

// export const isOwner = async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         const currentUserId = get(req, 'identity._id').toString();
//         if (!currentUserId) {
//             return res.sendStatus(403);
//         }
//         if (currentUserId !== id) {
//             return res.sendStatus(403);
//         }
//         return next();
//     } catch (e) {
//         console.log(e);
//         return res.sendStatus(400);
//     }
// }