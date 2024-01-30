'use client'
import { User } from "@prisma/client";
import { useSession } from "next-auth/react"
import { useCallback } from "react";
import { useRouter } from 'next/navigation'

export default function RoleSwitcher() {
    const { data: session, status, update } = useSession()
    const { user } = session?.user ? session as { user: Partial<User> } : { user : null };
    const router = useRouter()

    const handleSwitch = useCallback((e : any) => {
        update( { roleId: e.target.value }).then(() => {
            setTimeout(() => {
                router.push('/', { scroll: false })
            }, 0)
        });
    }, [update, router])
    return (
        <>
        { user ?
            <div className="max-w-sm mx-auto space-y-6">
               <select value={user.roleId } onChange={handleSwitch}>
                    <option value="customer">
                        Customer
                    </option>
                    <option value="maintainer">
                        Maintainer
                    </option>
                
                </select> 
            </div>
        : null }
        </>
    )
}