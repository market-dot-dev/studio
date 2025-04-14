import UserService from "@/app/services/UserService";
import { DataTable } from "@/components/ui/data-table";
import { User, columns } from "./columns";

export default async function UsersList() {
  const users = await UserService.getCustomersMaintainers();

  return (
    <>
      <h2 className="mb-2 text-3xl font-bold">Users</h2>
      <DataTable columns={columns} data={users as User[]} />
    </>
  );
}
