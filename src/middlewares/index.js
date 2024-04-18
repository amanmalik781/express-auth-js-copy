import JWT from 'jsonwebtoken';

export const isAuthenticated = async (req, res, next) => {
    try {
        const sessionToken = req.cookies['token'];
        if (!sessionToken) {
            return res.sendStatus(403);
        }
        const payload = JWT.verify(sessionToken, process.env.SECRET);
        if (payload?.id === req.params.id) {
            return next();
        }
        return res.sendStatus(403);
    } catch (e) {
        console.log(e);
        return res.sendStatus(400);
    }
}