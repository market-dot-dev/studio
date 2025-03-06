'use client'

import { useState } from "react";
import { TableRow, TableCell } from '@tremor/react';
import { Button } from "@/components/ui/button";

export default function Subscription({ subscription }: { subscription: any }) {
    const [isDeleting, setIsDeleting] = useState(false);
    
    // this is just a temporary solution to hide the deleted subscription
    const [deleted, setDeleted] = useState(false);

    const onDelete = async () => {
        setIsDeleting(true);
        await fetch('/api/subscription', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                subscriptionId: subscription.id
            })
        });
        setDeleted(true);
        setIsDeleting(false);
    }

    return (
        <>
            {deleted ? null : <TableRow >
                <TableCell>{subscription.tierVersion.tier.name}</TableCell>
                <TableCell>
                    <Button onClick={onDelete} disabled={isDeleting} loading={isDeleting}>Cancel</Button>
                </TableCell>
            </TableRow>}
        </>
    )
}