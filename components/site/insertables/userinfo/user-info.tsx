export default function UserInfo({ user }: { user: any }) {
    return (
        <div className="flex flex-col space-y-6">
            <section>
                <div className="mx-auto max-w-screen-xl lg:py-4">
                    Welcome {user?.email}
                </div>
            </section>
        </div>
    )
}