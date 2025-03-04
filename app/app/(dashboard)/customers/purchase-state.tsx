import { Charge } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

const PurchaseStatusBadge = ({ charge }: { charge: Charge; }) => {
  return (
    <Badge variant="success">Purchased</Badge>
  );
};

export default PurchaseStatusBadge;