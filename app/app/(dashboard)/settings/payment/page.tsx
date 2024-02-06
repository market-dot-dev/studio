"use server";

import Form from "@/components/form";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { editUser } from "@/lib/actions";
import { Card, Flex, Text, TextInput, Button, Grid, Bold, Badge, Title } from "@tremor/react";
import UserService from "@/app/services/UserService";

import UserProductWidget from "../UserCustomerWidget";
import UserCustomerWidget from "../UserCustomerWidget";
import UserPaymentMethodWidget from "@/components/common/user-payment-method-widget";



export default async function PaymentSettings() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const user = await UserService.findUser(session.user.id!);

  if (!user) {
    redirect("/login");
  }

  return (    
    <div className="space-y-6">
      <Title>Payment Settings</Title>
      <Card className='border-2 border-slate-800 bg-slate-50'>
        <Badge size="xs" className="me-2 mb-1.5">FOR DEBUGGING PURPOSES ONLY</Badge>
        <Flex flexDirection="col" alignItems="start" className="gap-4">
          <UserProductWidget user={user} />
          <UserCustomerWidget user={user} />
          { /* <UserPaymentMethodWidget userId={user.id} /> */ }
        </Flex>
      </Card>
  </div>
  );
}
