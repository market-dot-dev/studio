"use server";

import prisma from "@/lib/prisma";
import { getSession, getAccessToken } from "@/lib/auth";

export const addRepo = async ({ name }: { name: string}) => {

    const session = await getSession();

    if (!session?.user.id) {
        return { error: "Not authenticated" };
    }

    // get github access token from user
    const accessToken = await getAccessToken(session.user.id);

    // verify if the user has admin access to the repo
    const response = await fetch(`https://api.github.com/repos/${name}/collaborators/${session.user.username}`, {
        headers: {
            Authorization: `token ${accessToken}`
        }
    });

    if (response.status !== 204) {
        return { error: "You don't have admin access to this repo" };
    }

    // const response = await prisma.repo.create({
    //     data: {
    //         name,
    //         url: '',
    //         userId: session.user.id,
    //     }
    // });

    return response;
}