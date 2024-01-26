import TierService from "@/app/services/TierService";
import PageHeading from "@/components/common/page-heading";
import { Divider, Flex } from "@tremor/react";

export default async function CustomersList({ params }: { params: { id: string } }) {

    const customers = await TierService.getCustomersOfUserTiers() as any[];
    console.log(customers)

    return (
      <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
        <div className="flex flex-col space-y-6">
        <PageHeading title="All Customers" />


        <div className="flex flex-col space-y-2">
          <h2>Your active and past customers</h2>
        </div>

        <div className="flex flex-col space-y-2">
          {customers.map((customer) => (
            <>
              <div key={customer.id} className="flex flex-col space-y-2">
                <h2>{customer.name}</h2>
                <p>{customer.email}</p>
                <p>{customer.id}</p> 
              </div>
              <Divider />
            </>
          ))
        }
        </div>

        </div>
      </div>
    );
  }