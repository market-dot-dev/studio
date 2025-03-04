"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Button, TextInput } from "@tremor/react";
import { Card } from "@/components/ui/card";
import { User } from "@prisma/client";

interface UserSelectionStepProps {
  selectedUsers: User[];
  setSelectedUsers: (users: User[]) => void;
}

export default function UserSelectionStep({ selectedUsers, setSelectedUsers }: UserSelectionStepProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch("/api/admin/users");
        
        if (!response.ok) {
          // Get error details from response
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data || !Array.isArray(data)) {
          throw new Error("Invalid data format returned from API");
        }
        
        console.log(`Loaded ${data.length} users from API`);
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(error instanceof Error ? error.message : "Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSelectUser = (user: User) => {
    if (selectedUsers.some(u => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };
  
  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers([...filteredUsers]);
    }
  };
  
  const isUserSelected = (userId: string) => {
    return selectedUsers.some(user => user.id === userId);
  };
  
  const isAllSelected = filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length;
  
  // Error state
  if (error) {
    return (
      <Card className="p-4 border border-red-200 bg-red-50">
        <h2 className="text-lg font-semibold text-red-700 mb-2">Error Loading Users</h2>
        <p className="text-red-600 mb-4">{error}</p>
        <p className="text-sm text-gray-700">
          This could be due to insufficient permissions or server issues. 
          Please ensure you have admin privileges and try again.
        </p>
        <Button
          color="red"
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          Retry
        </Button>
      </Card>
    );
  }
  
  // Loading state
  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-black rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading users...</p>
      </div>
    );
  }
  
  // Empty state
  if (users.length === 0) {
    return (
      <Card className="p-4 text-center">
        <h2 className="text-lg font-semibold mb-2">No Users Found</h2>
        <p className="text-gray-600 mb-4">
          There are no users in the system or you may not have permission to view them.
        </p>
      </Card>
    );
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Select Recipients</h2>
          <p className="text-sm text-gray-500">
            {selectedUsers.length} of {users.length} users selected
          </p>
        </div>
        <TextInput
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
      </div>
      
      <div className="mb-4">
        <Button
          variant="secondary"
          onClick={handleSelectAll}
          size="xs"
        >
          {isAllSelected ? "Deselect All" : "Select All"}
        </Button>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell className="w-12">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  className="h-4 w-4"
                />
              </TableHeaderCell>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="cursor-pointer hover:bg-gray-50" onClick={() => handleSelectUser(user)}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={isUserSelected(user.id!)}
                    onChange={() => handleSelectUser(user)}
                    className="h-4 w-4"
                  />
                </TableCell>
                <TableCell>{user.name || "N/A"}</TableCell>
                <TableCell>{user.email || "N/A"}</TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  No users found matching your search
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 