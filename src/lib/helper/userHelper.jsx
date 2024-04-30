// TODO: implement user auth and user info retrieval, since this is a hard-coded solution
let currentUser = {
    username: 'alice',
    email: 'alice@prisma.io',
    password: 'password123',
    isAdmin: true,
}

export function isAdmin() {
    return currentUser.isAdmin;
}

export function setUser(user) {
    currentUser = user;
}