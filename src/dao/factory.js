export let Users;
switch(config.persistence){
    case "MONGO":
        const connection = mongoose.conect(config.mongo_url)
        const {default:UsersMongo} = await import('./mongo/contacts.mongo.js');
        Users = UsersMongo;
        break;
    case "MEMORY":
        const {default:UsersMemory} = await import ('./memory/contacts.memory.js');
        Users = UsersMemory;
        break;
}