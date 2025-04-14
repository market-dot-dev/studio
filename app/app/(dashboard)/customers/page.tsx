import { customers as getCustomersData } from "@/app/services/UserService";
import PageHeader from "@/components/common/page-header";
import { CustomersTable } from "./customer-table";

const CustomersPage = async () => {
  const customers = await getCustomersData();
  return (
    <div className="flex max-w-screen-xl flex-col space-y-10">
      <PageHeader title="Customers" description="Manage your customers and their tiers here." />
      <CustomersTable customers={customers} />
    </div>
  );
};

export default CustomersPage;
