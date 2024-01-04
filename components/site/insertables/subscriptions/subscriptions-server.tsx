import { getSubscriptions } from '@/lib/tiers/fetchers';
import Subscriptions from './subscriptions';
import { getSession } from "@/lib/auth";
import { Title } from "@tremor/react";

// This is the component that will render at the frontend of the site, facing the customer
export async function SubscriptionsServer({ site, page, ...props }: { site: any, page: any, props: any }) {
    // a user should be logged in to view his/her subscriptions
    const session = await getSession();
    if (!session?.user.id) {
        return (
            <Title>You need to be logged in to view your subscriptions</Title>
        )
    }

    const subs = site?.userId ? await getSubscriptions(site.userId) as any[] : [];

    return (
        <Subscriptions subscriptions={subs} />
    )
}