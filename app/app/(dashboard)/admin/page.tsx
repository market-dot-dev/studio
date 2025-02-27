import Link from "next/link";
import { Card, Title } from "@tremor/react";

const AdminIndex = () => {
  return (
    <div className="container mx-auto py-8">
      <Title className="mb-4">Admin Tools</Title>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Email Tool</h2>
          <p className="text-sm text-gray-600 mb-4">
            Send bulk emails to all users with customizable content.
          </p>
          <Link 
            href="/app/admin/email" 
            className="inline-block bg-black text-white px-4 py-2 rounded-md text-sm"
          >
            Open Email Tool
          </Link>
        </Card>
        
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Debug Tools</h2>
          <p className="text-sm text-gray-600 mb-4">
            Access debug tools for troubleshooting.
          </p>
          <Link 
            href="/app/admin/debug" 
            className="inline-block bg-black text-white px-4 py-2 rounded-md text-sm"
          >
            Open Debug Tools
          </Link>
        </Card>
        
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Tier Management</h2>
          <p className="text-sm text-gray-600 mb-4">
            Manage and configure tiers.
          </p>
          <Link 
            href="/app/admin/tiers" 
            className="inline-block bg-black text-white px-4 py-2 rounded-md text-sm"
          >
            Manage Tiers
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default AdminIndex;