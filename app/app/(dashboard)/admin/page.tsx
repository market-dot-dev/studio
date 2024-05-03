import PageHeading from "@/components/common/page-heading";
import { Card } from "flowbite-react";

const AdminIndex = () => {
  return (
    <div>
      <PageHeading title="Admin" />
      <Card>
      <ul>
        <li>
          <a href="/admin/tiers">Tiers</a>
        </li>
      </ul>
      </Card>
    </div>
  );
};

export default AdminIndex;