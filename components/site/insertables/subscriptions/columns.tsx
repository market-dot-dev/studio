"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { useState } from "react"

// This type is used to define the shape of our data.
export type Subscription = {
  id: string
  tierVersion: {
    tier: {
      name: string
    }
  }
}

// Factory function to create columns with an onDelete callback
export const createColumns = (onDelete?: (id: string) => void): ColumnDef<Subscription>[] => [
  {
    accessorKey: "tierVersion.tier.name",
    header: "Tier",
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const subscription = row.original
      const [isDeleting, setIsDeleting] = useState(false)
      
      const handleDelete = async () => {
        setIsDeleting(true)
        try {
          await fetch('/api/subscription', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              subscriptionId: subscription.id
            })
          })
          
          // Call the onDelete callback if provided
          if (onDelete) {
            onDelete(subscription.id)
          }
        } catch (error) {
          console.error('Error deleting subscription:', error)
        }
        setIsDeleting(false)
      }
      
      return (
        <Button 
          onClick={handleDelete} 
          disabled={isDeleting}
        >
          {isDeleting ? "Cancelling..." : "Cancel"}
        </Button>
      )
    }
  }
]

// Default columns without the onDelete handler
export const columns = createColumns() 