import {
    Flex,
    Title,
    Table,
    TableHead,
    TableHeaderCell,
    TableBody,
    TableRow,
} from '@tremor/react';
import Subscription from "./subscription";

export default function Subscriptions({subscriptions} : { subscriptions : any[] }) {
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

                    {subscriptions.map((subscription: any, index: number) => (
                        <Subscription key={index} subscription={subscription} />
                    ))}

                </TableBody>
            </Table>

        </Flex>
    )
}