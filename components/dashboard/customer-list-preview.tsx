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
  Bold,
  Badge,
} from "@tremor/react";
import DashboardCard from "@/components/common/dashboard-card";
import LinkButton from "@/components/common/link-button";

const customersList = [
  {
    id: "ID-1",
    name: "Peter Doe",
    tier: "Premium",
    status: "New",
    dateSince: "01/01/2021",
    nextRenewal: "01/01/2022",
    location: "New York",
    company: "Acme Inc.",
  },
  {
    id: "ID-2",
    name: "John Doe",
    tier: "Premium Plus",
    status: "New",
    dateSince: "01/01/2021",
    nextRenewal: "01/01/2022",
    location: "New York",
    company: "Acme Inc.",
  },
  {
    id: "ID-3",
    name: "Jane Doe",
    tier: "Premium",
    status: "New",
    dateSince: "01/01/2021",
    nextRenewal: "01/01/2022",
    location: "New York",
    company: "Acme Inc.",
  },
  {
    id: "ID-4",
    name: "Eve Doe",
    tier: "Enterprise",
    status: "New",
    dateSince: "01/01/2021",
    nextRenewal: "01/01/2022",
    location: "New York",
    company: "Acme Inc.",
  },
];

export default function CustomersListPreview() {
  return (
    <div className="flex max-w-screen-xl flex-col space-y-4">
      <DashboardCard>
        <Bold>New Customers</Bold>

        <Table className="">
          <TableHead>
            <TableRow>
              <TableHeaderCell>ID</TableHeaderCell>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell className="text-right">Company</TableHeaderCell>
              <TableHeaderCell className="text-right">Tier</TableHeaderCell>
              <TableHeaderCell className="text-right">Status</TableHeaderCell>
              <TableHeaderCell className="text-right">Subscription Date</TableHeaderCell>
              <TableHeaderCell className="text-right">Renewal</TableHeaderCell>
              <TableHeaderCell className="text-right"></TableHeaderCell>
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
                    <Badge size="xs">
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="p-2 m-0 text-right">{item.dateSince}</TableCell>
                  <TableCell className="p-2 m-0 text-right">{item.nextRenewal}</TableCell>
                  <TableCell className="p-2 m-0 text-right">
                    <div className="flex flex-row gap-1 justify-end">
                      <Button size="xs" variant="primary" color="green">
                        View
                      </Button>
                      <Button size="xs" variant="primary">
                        Decline
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </DashboardCard>
      <div className="grid justify-items-end">
      <Button size="xs" className="h-6" variant="secondary">
            All Customers →
          </Button>
        </div>
    </div>
  );
}