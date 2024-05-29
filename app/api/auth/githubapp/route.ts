import { NextRequest } from "next/server";
import { cookies } from 'next/headers'
import RepoService from "@/app/services/RepoService";

const Actions = {
	CREATED: 'created',
	DELETED: 'deleted',
	REMOVED: 'removed', // removed repositories
	ADDED: 'added', // added repositories
}

export async function POST(req: NextRequest) {

	const chunks = [];

	for await (const chunk of req.body) {
		chunks.push(chunk);
	}
	const body = Buffer.concat(chunks).toString('utf-8');
	const parsedBody = JSON.parse(body);
	// console.log(parsedBody);
	const { action, installation: { id : installationId, account: { login }}, sender: { login: senderLogin} } = parsedBody;
	// console.log(action, installationId, login, senderLogin);
	if (Actions.CREATED === action) {
		RepoService.createInstallation(installationId, login, senderLogin)
	} else if (Actions.DELETED === action) {
		RepoService.removeInstallation(installationId)
	}


	return new Response('ok');
}

// github redirects to this route after the user has installed the github app
// export async function GET(req: NextRequest) {

// 	const searchParams = req.nextUrl.searchParams;
// 	const installation_id = searchParams.get('installation_id');
// 	const setup_action = searchParams.get('setup_action');
// 	const state = searchParams.get('state');

// 	if (!installation_id || !setup_action || !state ) {
// 		return new Response('Invalid request', { status: 400 });
// 	}

// 	// check if the state is valid
// 	const savedState = cookies().get('ghstate')
	
// 	if (!state || !savedState || state !== savedState?.value) {
// 		return new Response('Invalid state', { status: 400 });
// 	}
	
// 	if ( 'install' === setup_action ) {
// 		RepoService.createInstallation(parseInt(installation_id))
// 	}



// 	// return a close window message
// 	return new Response(
// 		`<!DOCTYPE html>
//         <html>
//           <head>
//             <title>Close this window</title>
//           </head>
//           <body>
//             <p>This window can be closed.</p>
//             <script>
//               window.close();
//             </script>
//           </body>
//         </html>`,
// 		{
// 			headers: {
// 				"Content-Type": "text/html",
// 			},
// 		}
// 	);
// }