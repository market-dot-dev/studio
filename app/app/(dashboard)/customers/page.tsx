import PageHeading from "@/components/common/page-heading";
import {
  Button,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableBody,
  BadgeDelta,
} from "@tremor/react";
import DashboardCard from "@/components/common/dashboard-card";
import LinkButton from "@/components/common/link-button";

const customersList = [
  {
    id: "ID-1",
    name: "Peter Doe",
    tier: "Premium",
    status: "Active",
    dateSince: "01/01/2021",
    nextRenewal: "01/01/2022",
    location: "New York",
    company: "Acme Inc.",
  },
  {
    id: "ID-2",
    name: "John Doe",
    tier: "Premium",
    status: "Active",
    dateSince: "01/01/2021",
    nextRenewal: "01/01/2022",
    location: "New York",
    company: "Acme Inc.",
  },
  {
    id: "ID-3",
    name: "Jane Doe",
    tier: "Premium",
    status: "Active",
    dateSince: "01/01/2021",
    nextRenewal: "01/01/2022",
    location: "New York",
    company: "Acme Inc.",
  },
  {
    id: "ID-4",
    name: "Eve Doe",
    tier: "Premium",
    status: "Active",
    dateSince: "01/01/2021",
    nextRenewal: "01/01/2022",
    location: "New York",
    company: "Acme Inc.",
  },
  {
    id: "ID-5",
    name: "Peter Doe",
    tier: "Premium",
    status: "Active",
    dateSince: "01/01/2021",
    nextRenewal: "01/01/2022",
    location: "New York",
    company: "Acme Inc.",
  },
  {
    id: "ID-6",
    name: "Peter Doe",
    tier: "Premium",
    status: "Active",
    dateSince: "01/01/2021",
    nextRenewal: "01/01/2022",
    location: "New York",
    company: "Acme Inc.",
  },
  {
    id: "ID-7",
    name: "Peter Doe",
    tier: "Premium",
    status: "Active",
    dateSince: "01/01/2021",
    nextRenewal: "01/01/2022",
    location: "New York",
    company: "Acme Inc.",
  },
  {
    id: "ID-8",
    name: "Peter Doe",
    tier: "Premium",
    status: "Active",
    dateSince: "01/01/2021",
    nextRenewal: "01/01/2022",
    location: "New York",
    company: "Acme Inc.",
  },
];

export default function CustomersList({ params }: { params: { id: string } }) {
  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
      <div className="flex justify-between w-full">
        <div className="flex flex-row">
          <PageHeading title="All Customers" />
        </div>
        <div className="flex flex-row gap-1">
          <LinkButton href="/customers/new" label="New Customer" />
        </div>
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
            {customersList
              .map((item) => (
                <TableRow className="p-2 m-0" key={item.name}>
                  <TableCell className="p-2 m-0">{item.id}</TableCell>
                  <TableCell className="p-2 m-0">{item.name}</TableCell>
                  <TableCell  className="p-2 m-0 text-right">{item.company}</TableCell>
                  <TableCell className="p-2 m-0 text-right">{item.tier}</TableCell>
                  <TableCell className="p-2 m-0 text-right">
                    <BadgeDelta size="xs">
                      {item.status}
                    </BadgeDelta>
                  </TableCell>
                  <TableCell className="p-2 m-0 text-right">{item.dateSince}</TableCell>
                  <TableCell className="p-2 m-0 text-right">{item.nextRenewal}</TableCell>
                  <TableCell className="p-2 m-0 text-right">{item.location}</TableCell>
                  <TableCell className="p-2 m-0 text-right">
                    <div className="flex flex-row gap-1 justify-end">
                      <Button size="xs" variant="primary">
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </DashboardCard>
    </div>
  );
}