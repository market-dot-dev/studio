import {
  Text,
} from '@tremor/react';
import React from 'react';
import PageHeading from '@/components/common/page-heading';
import CustomersTable from './customer-table';
import { customers as getCustomersData } from '@/app/services/UserService';
const CustomersPage = async () => {
  const customers = await getCustomersData();
  return (
    <div className="flex max-w-screen-xl flex-col space-y-12">
      <div className="flex w-full justify-between">
        <div className="flex flex-col">
          <PageHeading title="All Customers" />
          <Text>Manage your customers and their tiers here.</Text>
        </div>
      </div>
      <CustomersTable customers={customers} />
    </div>
  );
};

export default CustomersPage;