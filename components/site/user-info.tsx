import { getSession } from "@/lib/auth";

// This component will be used to render the preview while editing the page
export function UserInfoPreview() {
    return (
        <div>User Info Preview for client side</div>
    )
}

export async function UserInfo() {

    const session = await getSession();
    
    return (
        <div className="flex flex-col space-y-6">
            <section>
                <div className="mx-auto max-w-screen-xl lg:py-4">
                    Welcome {session?.user?.email}
                </div>
            </section>
        </div>
    )
}