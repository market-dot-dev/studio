'use client'

import Subscriptions from "./subscriptions"

// This component will be used to render the preview while editing the page
export function SubscriptionsClient({ site, page, ...props }: { site: any, page: any, props: any }) {
    return (
        <Subscriptions subscriptions={[]} />
    )
}