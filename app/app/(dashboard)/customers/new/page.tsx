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

export default function NewCustomer({ params }: { params: { id: string } }) {
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
            <div className="flex justify-between w-full">
                <div className="flex flex-row">
                    <PageHeading title="Add A Customer" />
                </div>
                <div className="flex flex-row gap-1">
                    <LinkButton href="/customers/new" label="New Customer" />
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={customer.name}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="company">Company:</label>
                    <input
                        type="text"
                        id="company"
                        name="company"
                        value={customer.company}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="contactInfo">Contact Information:</label>
                    <input
                        type="text"
                        id="contactInfo"
                        name="contactInfo"
                        value={customer.contactInfo}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}