 import userModel from "./models/userModel.js"

export default class UserService {

    async create(user) {
        const result = await userModel.create(user);

        return result;
    }

    async getAll() {
        return await userModel.find();
    }

    async getById(uid) {
        const result = await userModel.findOne({_id: uid});

        if (!result) throw new Error (`El usuario ${uid} no existe!`);

        return result;
    }

    async updateRole(uid, newRole) {
        const updatedUser = await UserModel.findByIdAndUpdate(uid, { role }, { new: true });
        return updatedUser;
    }

    async delete(uid) {
        const result = await userModel.deleteOne({_id: uid})

        return result;
    }

}