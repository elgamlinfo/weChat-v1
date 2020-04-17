let users = [];

const addUser = ({ id, username, room }) => {
    //clean data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    //validate data 
    if (!username || !room) {
        return {
            error: 'UserName And Room Has Required!'
        }
    }

    //check for existing
    const existUserData = users.find((user) => {
        return user.room === room && user.username === username
    })

    if (existUserData) {
        return {
            error: 'UserName Is Used Please Try Anouter One!'
        }
    }
    const user = { id, username, room };
    users.push(user);
    return { user }
}  

const removeUser = (id) => {
    const index = users.findIndex((user)=> user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
} 

const getUser = (id) => {
    const index = users.findIndex((user)=> user.id === id);
    if (index !== -1) {
        return users[index];
    }else{
        return{
            undefined
        }
    }
}

const getUsersInRoom = (room) => {
    const dublicateUsers = users.filter((user) => {
        return user.room === room
    })
    return dublicateUsers;
}


module.exports= {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}