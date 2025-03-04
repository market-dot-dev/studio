import {
    Table,
    TableHead,
    TableHeaderCell,
    TableBody,
    TableRow,
} from '@tremor/react';
import Subscription from "./subscription";

export default function Subscriptions({subscriptions} : { subscriptions : any[] }) {
    return (
        <div className="flex flex-col bg-slate-100 p-6">
            <h2 className="text-xl font-bold">Restore Onboarding State</h2>
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
        </div>
    )
}