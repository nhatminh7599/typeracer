const users = [];


// new user
function newUser(id, userName, roomId) {
    const user = { id, userName, roomId }
    return user
}


// list user joined room
function userJoined(user) {
    users.push(user)
}

// Get users
function getUsers(id) {
    return users.find(user => user.id == id)
}

// User leaves chat
function userLeave (id, result) {
    let us = []
    console.log(users)
    for(let i = 0; i < users.length; i++)
    {
        if(users[i].id == id)
            {
                us.push(users[i])
                users.splice(i, 1)
                i--
            }
    }
    console.log(users)
    result(us)
}

// Get room users
function getRoomUsers (roomId) {
    return users.filter(user => user.roomId == roomId)
}

module.exports = {
    users,
    userJoined,
    getUsers,
    newUser,
    userLeave,
    getRoomUsers
}