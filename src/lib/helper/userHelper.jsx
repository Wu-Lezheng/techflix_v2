import prisma from "../prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// TODO: consider setting the user globally for better performance but this is not secure
let currentUser;

export async function isAdmin() {
    const session = await getServerSession(authOptions);
    if (session && session.user) {
        const userId = session.user.id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
        })
        return user.isAdmin;
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