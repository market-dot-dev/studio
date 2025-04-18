import { Badge } from "@/components/ui/badge";
import { Charge } from "@prisma/client";

const PurchaseStatusBadge = ({ charge }: { charge: Charge }) => {
  return <Badge variant="success">Purchased</Badge>;
};

export default PurchaseStatusBadge;
