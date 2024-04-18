import { deleteUser, updateUserName } from '../controllers/users.js';
import { isAuthenticated } from '../middlewares/index.js';

export default (router) => {
    router.delete('/users/:id', isAuthenticated, deleteUser);
    router.put('/users/:id', isAuthenticated, updateUserName);
};
