import { Charge } from "@/app/generated/prisma";
import { Badge } from "@/components/ui/badge";

export const PurchaseStatusBadge = ({ charge }: { charge: Charge }) => {
  return <Badge variant="success">Purchased</Badge>;
};
