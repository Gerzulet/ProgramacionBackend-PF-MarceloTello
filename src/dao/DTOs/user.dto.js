export default class UserDTO {
    constructor (user) {
        this.first_name = user.first_name ?? 'Desconocido';
        this.last_name = user.last_name ?? '';
        this.full_name = `${this.first_name} ${this.last_name}`;
        this.email = user.email ?? 'Sin email' ;
        this.age = user.age ?? '' ;
    }
}