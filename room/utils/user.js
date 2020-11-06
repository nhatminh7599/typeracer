const users = [];


// new user
function newUser(id, userName, roomId) {
    const user = { id, userName, roomId }
    user.isReady = false
    user.pagaraph = ""
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

async function checkReady(roomId) {
    list = await getRoomUsers(roomId)
    let kq = await true
    if(list) {
        for(let i = 0; i < list.length; i++){
            if (await !list[i].isReady) {
                kq = await false
                break
            }
        }
    }
    return await kq
}

// User leaves chat
function userLeave (id, result) {
    let us = []
    for(let i = 0; i < users.length; i++)
    {
        if(users[i].id == id)
            {
                us.push(users[i])
                users.splice(i, 1)
                i--
            }
    }
    result(us)
}

// Get room users
function getRoomUsers (roomId) {
    return users.filter(user => user.roomId == roomId)
}

function getRoomPagaraph (roomId) {
    let user = getUsers(roomId)
    return user.pagaraph
}

module.exports = {
    users,
    userJoined,
    getUsers,
    newUser,
    userLeave,
    getRoomUsers,
    checkReady,
    getRoomPagaraph
}