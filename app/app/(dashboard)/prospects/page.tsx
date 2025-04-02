"use client";

import React, { useState } from "react";
import PageHeader from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import MockProspectService from "@/app/services/MockProspectService";
import { useEffect } from "react";
import Prospect from "@/app/models/Prospect";

export default function ProspectsPage() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProspects = async () => {
      setLoading(true);
      try {
        const data = await MockProspectService.getAllProspects();
        setProspects(data);
      } catch (error) {
        console.error("Error fetching prospects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProspects();
  }, []);

  if (loading) {
    return (
      <div className="flex max-w-screen-xl flex-col space-y-10">
        <PageHeader
          title="Prospects"
          description="View all prospects who have submitted an interest in your products."
        />
        <div className="flex justify-center py-10">
          <div className="w-10 h-10 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex max-w-screen-xl flex-col space-y-10">
      <PageHeader
        title="Prospects"
        description="View all prospects who have submitted an interest in your products."
        actions={[
          <Button key="add-prospect" variant="default" asChild>
            <Link href="/prospects/new">
              Add Prospect
            </Link>
          </Button>,
        ]}
      />
      
      <DataTable 
        columns={columns} 
        data={prospects}
        isLoading={loading}
        noResults="No prospects found"
        className="bg-transparent shadow-none"
      />
    </div>
  );
}
