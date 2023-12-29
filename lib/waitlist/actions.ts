"use server";

import prisma from "@/lib/prisma";

export const addUserToWaitlist = async ({ email }: { email: string }) => {
	
	const response = await prisma.waitlistUser.create({ // Updated property name to 'waitlistUser'
		data: {
			email: email,
		},
	});

	return response;
};