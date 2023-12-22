import { getSession } from "@/lib/auth";
import UserInfo from "./user-info";

export default async function UserInfoServer() {

    const session = await getSession();
    
    return (
        <UserInfo user={session?.user} />
    )
}