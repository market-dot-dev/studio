import UserService from "@/app/services/UserService";
import { Card } from "@/components/ui/card";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { User } from "@prisma/client";
import UserAnalyticsChart from "./user-analytics-chart";
import UserAnalyticsFilter from "./user-analytics-filter";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default async function UsersAnalytics() {
  // Explicitly type the result to deal with TypeScript confusion about the result type
  const users = (await UserService.getCustomersMaintainers()) as unknown as (User & {
    createdAt: Date | null;
  })[];
  
  console.log(`Found ${users.length} users`);
  
  // Current date and time for comparison
  const now = new Date();
  
  // Count users with dates
  const usersWithDates = users.filter(user => !!user.createdAt);
  
  // Sort users by join date (newest first) for the table display
  const sortedUsers = [...users].sort((a, b) => {
    // Handle missing dates
    if (!a.createdAt) return 1;  // Push items without dates to the end
    if (!b.createdAt) return -1;
    
    try {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    } catch (e) {
      return 0;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">User Analytics</h2>
        <UserAnalyticsFilter />
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>User Statistics</AlertTitle>
        <AlertDescription>
          Found {users.length} total users. 
          Today is {now.toDateString()}.
        </AlertDescription>
      </Alert>

      <Card className="p-6">
        <UserAnalyticsChart users={users} />
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">User List ({users.length} users)</h3>
        <DataTable 
          columns={columns} 
          data={sortedUsers}
          tableOptions={{
            initialState: {
              sorting: [
                {
                  id: "createdAt",
                  desc: true
                }
              ]
            }
          }} 
        />
      </div>
    </div>
  );
} 