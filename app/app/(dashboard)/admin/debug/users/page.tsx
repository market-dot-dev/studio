import UserService from "@/app/services/UserService";
import { Card } from "@/components/ui/card";
import { User, columns } from "./columns";
import { DataTable } from "./data-table";

export default async function UsersList() {
	const users = await UserService.getCustomersMaintainers();
	
	return (
		<>
			<h2 className="text-3xl font-bold mb-2">Users</h2>
			<DataTable columns={columns} data={users as User[]} />
		</>
	  );
}