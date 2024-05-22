import { Charge } from "@prisma/client";
import { Badge } from "@tremor/react";

const PurchaseStatusBadge = ({ charge }: { charge: Charge; }) => {
  return (
    <Badge color="green">Purchased</Badge>
  );
};

export default PurchaseStatusBadge;