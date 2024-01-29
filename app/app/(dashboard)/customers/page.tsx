import TierService from "@/app/services/TierService";
import DashboardCard from "@/components/common/dashboard-card";
import PageHeading from "@/components/common/page-heading";
import { BadgeDelta, Button, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@tremor/react";

export default async function CustomersList({ params }: { params: { id: string } }) {

    const customers = await TierService.getCustomersOfUserTiers() as any[];
    
    return (
      <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
        <div className="flex justify-between w-full">
          <div className="flex flex-row">
            <PageHeading title="All Customers" />
          </div>
          {/* <div className="flex flex-row gap-1">
            <LinkButton href="/customers/new" label="New Customer" />
          </div> */}
        </div>



        <DashboardCard>
          <Table className="">
            <TableHead>
              <TableRow>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell className="text-right">Company</TableHeaderCell>
                <TableHeaderCell className="text-right">Tier</TableHeaderCell>
                <TableHeaderCell className="text-right">Status</TableHeaderCell>
                <TableHeaderCell className="text-right">Customer Since</TableHeaderCell>
                <TableHeaderCell className="text-right">Next Renewal</TableHeaderCell>
                <TableHeaderCell className="text-right">Location</TableHeaderCell>
                <TableHeaderCell className="text-right">Actions</TableHeaderCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {customers.map((customer) => (
                <TableRow className="p-2 m-0" key={customer.id}>
                  <TableCell className="p-2 m-0">{customer.id}</TableCell>
                  <TableCell className="p-2 m-0">{customer.name}</TableCell>
                  <TableCell className="p-2 m-0 text-right">{/* Company */}</TableCell>
                  <TableCell className="p-2 m-0 text-right">{customer.Subscription[0]?.Tier?.name}</TableCell>
                  <TableCell className="p-2 m-0 text-right">
                    <BadgeDelta size="xs">
                      
                    </BadgeDelta>
                  </TableCell>
                  <TableCell className="p-2 m-0 text-right">{ new Date(customer.Subscription[0]?.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="p-2 m-0 text-right">{/* Next Renewal */}</TableCell>
                  <TableCell className="p-2 m-0 text-right">{/* Location */}</TableCell>
                  <TableCell className="p-2 m-0 text-right">
                    <div className="flex flex-row gap-1 justify-end">
                      <Button size="xs" variant="primary">
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
              )}
            </TableBody>
          </Table>
        </DashboardCard>







        

    </div>

    );
  }