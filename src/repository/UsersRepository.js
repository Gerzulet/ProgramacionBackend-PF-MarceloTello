import UserDTO from "../dao/DTOs/user.dto.js";

export default class UserRepository {
    constructor (dao) {
        this.dao = dao;
    }

    async getUsers() {
        return await this.dao.getAll();
    }

    async getUserById(uid) {
        return await this.dao.getById(uid);
    }

    async createUser(user) {
        const newUser = new UserDTO(user);
        return await this.dao.create(newUser);
    }

    async updateUserRole(uid, role) {
        return await this.dao.updateRole(uid, role);
    }

    async deleteUser(uid) {
        return await this.dao.delete(uid);
    }
}

