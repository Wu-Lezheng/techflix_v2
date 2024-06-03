import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

// TODO: consider setting the user globally for better performance but this is not secure
let currentUser;

export async function isAdmin() {
    const session = await getServerSession(authOptions);
    if (session && session.user) {
        return session.user.isAdmin;
    }
    return false;;
}

export async function getUserId() {
    const session = await getServerSession(authOptions);
    if (session && session.user) {
        return session.user.id;
    }
    return "";
}

export function setUser(user) {
    currentUser = user;
}