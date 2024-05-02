// TODO: implement user auth and user info retrieval, since this is a hard-coded solution
let currentUser = {
    id: 'clvp8f1kv0000ooixz3hx0q12',
    username: 'alice',
    email: 'alice@prisma.io',
    password: 'password123',
    isAdmin: true,
}

export function isAdmin() {
    return currentUser.isAdmin;
}

export function getUserId() {
    return currentUser.id;
}

export function setUser(user) {
    currentUser = user;
}