import { login, register, logout } from '../controllers/authentication.js';

export default (router) => {
    router.post('/auth/register', register);
    router.post('/auth/login', login);
    router.get("/auth/logout", logout);
};
