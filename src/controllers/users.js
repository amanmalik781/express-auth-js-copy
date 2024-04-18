import { getUsers, deleteUserById, getUserById } from '../db/users.js';
// What is the diff b/w status and sendStatus?

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await deleteUserById(id);
        return res.status(200).json(deletedUser).end();
    } catch (e) {
        console.log(e);
        return res.sendStatus(400);
    }
}

export const updateUserName = async (req, res) => {
    try {
        const { id } = req.params;
        const { username } = req.body;
        if (!username) {
            return res.sendStatus(400);
        }
        const user = await getUserById(id);
        user.username = username;
        const updatedUser = await user.save();
        return res.status(200).json(updatedUser).end();
    } catch (e) {
        console.log(e);
        return res.sendStatus(400);
    }
}