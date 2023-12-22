'use client'
import { useSession } from "next-auth/react"
import UserInfo from "./user-info"
import { useState, useEffect } from "react";

export default function UserInfoClient({site, page} : {site : any, page : any}) {
    
    const [user, setUser] = useState<any>(null);
    const { data: session, status } = useSession();
    
    useEffect(() => {
        if (status === "authenticated") {
            setUser(session?.user);
        } else {
            setUser(null);
        }
    }, [session, status])

    return (
        <UserInfo user={user} />
    )
}