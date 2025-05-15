"use client";

import { Tier } from "@/app/generated/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { format } from "date-fns";
import { EyeIcon } from "lucide-react";
import Link from "next/link";

interface UserCreatedTiersProps {
  tiers: Tier[];
}

export default function UserCreatedTiers({ tiers }: UserCreatedTiersProps) {
  const hasTiers = tiers.length > 0;

  const formatPrice = (price: number | null) => {
    if (price === null) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price / 100);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tiers Created By User</h2>
      <p className="-mt-4 text-sm text-gray-500">
        These are tiers/products that this user has created to sell to others
      </p>

      {hasTiers ? (
        <Card>
          <CardHeader>
            <CardTitle>Created Tiers</CardTitle>
            <CardDescription>
              Products or services this user has created and is offering
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tier Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Monthly Price</TableHead>
                  <TableHead>Annual Price</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tiers.map((tier) => (
                  <TableRow key={tier.id}>
                    <TableCell className="font-medium">{tier.name}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {tier.description || tier.tagline || "No description"}
                    </TableCell>
                    <TableCell>{formatPrice(tier.price)}</TableCell>
                    <TableCell>{formatPrice(tier.priceAnnual)}</TableCell>
                    <TableCell>{format(new Date(tier.createdAt), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      <Badge variant={tier.published ? "default" : "outline"}>
                        {tier.published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/admin/tiers/${tier.id}`}>
                          <EyeIcon className="mr-1 size-4" />
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Tiers Created</CardTitle>
            <CardDescription>This user hasn&apos;t created any tiers or products</CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
