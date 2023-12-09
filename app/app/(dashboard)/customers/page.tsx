import PageHeading from "@/components/common/page-heading";

export default function CustomersList({ params }: { params: { id: string } }) {
    return (
      <div className="flex max-w-screen-xl flex-col space-y-12 p-8">
        <div className="flex flex-col space-y-6">
        <PageHeading title="All Customers" />


        <div className="flex flex-col space-y-2">
          <h2>Your active and past customers</h2>
        </div>

        </div>
      </div>
    );
  }