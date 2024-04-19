import { NextRequest } from "next/server";
import { cookies } from 'next/headers'
import RepoService from "@/app/services/RepoService";

// GitHub redirects to this route after the user has installed the GitHub app
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const installation_id = searchParams.get('installation_id');
    const setup_action = searchParams.get('setup_action');
    const state = searchParams.get('state');

    if (!setup_action || !state) {
        return new Response('Invalid request', { status: 400 });
    }

    // Check if the state is valid
    const savedState = cookies().get('ghstate');
    
    if (!state || !savedState || state !== savedState?.value) {
        return new Response('Invalid state', { status: 400 });
    }
    
    if (setup_action === 'install') {
        await RepoService.createInstallation(parseInt(installation_id));
    }

    // Handling setup_action 'request'
    if (setup_action === 'request') {
        return new Response(
            `<!DOCTYPE html>
            <html>
                <head>
                    <title>Installation Request Sent</title>
                </head>
                <body>
                    <p>The app installation has been sent to the owner of the organization, and you will have access once it is approved.</p>
                    <button onclick="window.close()">Close Window</button>
                </body>
            </html>`,
            {
                headers: {
                    "Content-Type": "text/html",
                },
            }
        );
    }

    // Default close window message for other actions
    return new Response(
        `<!DOCTYPE html>
        <html>
            <head>
                <title>Close this window</title>
            </head>
            <body>
                <p>This window can be closed.</p>
                <script>
                    window.close();
                </script>
            </body>
        </html>`,
        {
            headers: {
                "Content-Type": "text/html",
            },
        }
    );
}
