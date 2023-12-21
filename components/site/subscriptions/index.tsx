import { getSubscriptions } from "@/lib/tiers/fetchers"
import {
    Flex, Title, Text,
    Table,
    TableHead,
    TableHeaderCell,
    TableBody,
    TableRow,
} from '@tremor/react';
import Subscription from "./subscription";


// This component will be used to render the preview while editing the page
export function SubscriptionsPreview({ site, page, ...props }: { site: any, page: any, props: any }) {
    return (
        <Flex className="bg-slate-100">
            <Title>My Subscriptions</Title>
            <Text>Subscriptions Preview for client side</Text>
        </Flex>
    )
}


// This is the component that will render at the frontend of the site, facing the customer
export async function Subscriptions({ site, page, ...props }: { site: any, page: any, props: any }) {

    const subs = site?.userId ? await getSubscriptions(site.userId) as any[] : [];

    return (
        <Flex flexDirection="col" className="bg-slate-100 p-6">
            <Title>My Subscriptions</Title>
            <Table className="mt-5">
                <TableHead>
                    <TableRow>
                        <TableHeaderCell>Tier</TableHeaderCell>
                        <TableHeaderCell>Action</TableHeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody>

                    {subs.map((subscription: any, index: number) => (
                        <Subscription key={index} subscription={subscription} />
                    ))}

                </TableBody>
            </Table>

        </Flex>
    )
}