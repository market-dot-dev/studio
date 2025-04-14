"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Charge, Subscription, Tier } from "@prisma/client";
import { format } from "date-fns";

interface UserPurchasesProps {
  subscriptions: (Subscription & { tier: Tier })[];
  charges: (Charge & { tier: Tier })[];
}

export default function UserPurchases({ subscriptions, charges }: UserPurchasesProps) {
  const hasSubscriptions = subscriptions.length > 0;
  const hasCharges = charges.length > 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price / 100);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Purchased Products</h2>
      <p className="-mt-4 text-sm text-gray-500">
        Products and services this user has purchased from other users
      </p>

      {hasSubscriptions ? (
        <Card>
          <CardHeader>
            <CardTitle>Active Subscriptions</CardTitle>
            <CardDescription>Recurring products the user is subscribed to</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tier</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Billing Cycle</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((subscription) => {
                  // Extract the subscription price from the tier
                  const price = subscription.priceAnnual
                    ? (subscription.tier.priceAnnual ?? subscription.tier.price ?? 0)
                    : (subscription.tier.price ?? 0);

                  return (
                    <TableRow key={subscription.id}>
                      <TableCell className="font-medium">{subscription.tier.name}</TableCell>
                      <TableCell>{formatPrice(price)}</TableCell>
                      <TableCell className="capitalize">
                        {subscription.priceAnnual ? "yearly" : "monthly"}
                      </TableCell>
                      <TableCell>
                        {format(new Date(subscription.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={subscription.cancelledAt ? "outline" : "default"}
                          className="capitalize"
                        >
                          {subscription.cancelledAt ? "cancelled" : "active"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Active Subscriptions</CardTitle>
            <CardDescription>This user doesn&apos;t have any active subscriptions</CardDescription>
          </CardHeader>
        </Card>
      )}

      {hasCharges && (
        <Card>
          <CardHeader>
            <CardTitle>One-time Purchases</CardTitle>
            <CardDescription>One-time product purchases the user has made</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tier</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Reference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {charges.map((charge) => {
                  // Extract the charge price from the tier
                  const price = charge.tier.price ?? 0;

                  return (
                    <TableRow key={charge.id}>
                      <TableCell className="font-medium">{charge.tier.name}</TableCell>
                      <TableCell>{formatPrice(price)}</TableCell>
                      <TableCell>{format(new Date(charge.createdAt), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <span className="font-mono text-xs">
                          {charge.stripeChargeId.substring(0, 10)}...
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {!hasSubscriptions && !hasCharges && (
        <Card>
          <CardHeader>
            <CardTitle>No Products Purchased</CardTitle>
            <CardDescription>
              This user hasn&apos;t purchased any products or subscriptions
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
