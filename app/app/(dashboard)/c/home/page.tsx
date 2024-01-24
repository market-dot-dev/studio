"use client";
import PageHeading from "@/components/common/page-heading";
import {
  Button,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableBody,
  BadgeDelta,
} from "@tremor/react";
import DashboardCard from "@/components/common/dashboard-card";
import LinkButton from "@/components/common/link-button";
import React, { useState } from "react";

export default function CustomerDashboard({ params }: { params: { id: string } }) {
    const [customer, setCustomer] = useState({
        name: "",
        company: "",
        contactInfo: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCustomer((prevCustomer) => ({
            ...prevCustomer,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // TODO: Submit customer data
        console.log(customer);
    };

    return (
        <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
            Homepage
        </div>
    );
}