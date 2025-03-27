import { notFound } from "next/navigation"
import { format } from "date-fns"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import UserPurchases from "./user-purchases"
import UserCreatedTiers from "./user-created-tiers"

interface UserDetailPageProps {
  params: {
    id: string
  }
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const user = await prisma.user.findUnique({
    where: {
      id: params.id,
    },
    include: {
      subscriptions: {
        include: {
          tier: true,
        },
      },
      charges: {
        include: {
          tier: true,
        },
      },
      tiers: true,
    },
  })

  if (!user) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/users" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{user.name || "Unnamed User"}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium text-gray-500">ID</div>
              <div className="font-mono text-sm">{user.id}</div>

              <div className="text-sm font-medium text-gray-500">Name</div>
              <div>{user.name || "N/A"}</div>

              <div className="text-sm font-medium text-gray-500">Email</div>
              <div>{user.email || "N/A"}</div>

              <div className="text-sm font-medium text-gray-500">GitHub Username</div>
              <div>{user.gh_username || "N/A"}</div>
              
              <div className="text-sm font-medium text-gray-500">Role</div>
              <div className="capitalize">{user.roleId}</div>

              <div className="text-sm font-medium text-gray-500">Joined</div>
              <div>{format(new Date(user.createdAt), "PPP")}</div>
              
              <div className="text-sm font-medium text-gray-500">Last Updated</div>
              <div>{format(new Date(user.updatedAt), "PPP")}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-sm font-medium text-gray-500">Company</div>
              <div>{user.company || "N/A"}</div>
              
              <div className="text-sm font-medium text-gray-500">Business Type</div>
              <div>{user.businessType || "N/A"}</div>
              
              <div className="text-sm font-medium text-gray-500">Business Location</div>
              <div>{user.businessLocation || "N/A"}</div>

              <div className="text-sm font-medium text-gray-500">Project Name</div>
              <div>{user.projectName || "N/A"}</div>
              
              <div className="text-sm font-medium text-gray-500">Github ID</div>
              <div>{user.gh_id || "N/A"}</div>
              
              <div className="text-sm font-medium text-gray-500">Onboarding Status</div>
              <div>{user.onboarding || "N/A"}</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {user.roleId === "maintainer" || user.tiers.length > 0 ? (
        <UserCreatedTiers tiers={user.tiers} />
      ) : null}
      
      <UserPurchases 
        subscriptions={user.subscriptions} 
        charges={user.charges} 
      />
    </div>
  )
} 