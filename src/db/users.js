import mongoose from 'mongoose';

// schema of user object present in DB
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    authentication: {
        password: {
            type: String,
            required: true,
            select: false // this means that it won't be returned by default
        },
        salt: {
            type: String,
            required: true,
            select: false // this means that it won't be returned by default
        },
        sessionToken: {
            type: String,
            required: false,
            select: false // this means that it won't be returned by default
        }
    }
});

export const UserModel = mongoose.model('User', UserSchema);

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email) => UserModel.findOne({ email });
export const getUserBySessionToken = (sessionToken) => UserModel.findOne({
    'authentication.sessionToken': sessionToken
});
export const getUserById = (id) => UserModel.findById(id);
export const createUser = (values) => new UserModel(values)
    .save().then((user) => user.toObject());
export const deleteUserById = (id) => UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (id, values) => UserModel.findByIdAndUpdate({
    id, values
});
