import {getCurrentUser} from "@/app/services/UserService";
import UserInfo from "./user-info";

export default async function UserInfoServer() {

    const user = await getCurrentUser();
    
    return (
        <UserInfo user={ user } />
    )
}