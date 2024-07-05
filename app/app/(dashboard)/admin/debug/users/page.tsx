import UserService from "@/app/services/UserService";
import { Button, Card, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Title } from "@tremor/react";



export default async function UsersList() {
	const users = await UserService.getCustomersMaintainers();
	
	return (
		<>
			<Title className="mb-4">Users</Title>
			<Card className="container mx-auto py-8">
			
			<Table>
				<TableHead>
				<TableRow>
					<TableHeaderCell>ID</TableHeaderCell>
					<TableHeaderCell>GitHub Username</TableHeaderCell>
					<TableHeaderCell>Email</TableHeaderCell>
					<TableHeaderCell>Name</TableHeaderCell>
					<TableHeaderCell>Role</TableHeaderCell>
					<TableHeaderCell></TableHeaderCell>
				</TableRow>
				</TableHead>
				<TableBody>
				{users.map((user) => (
					<TableRow key={user.id}>
					<TableCell>{user.id}</TableCell>
					<TableCell>{user.gh_username || 'N/A'}</TableCell>
					<TableCell>{user.email}</TableCell>
					<TableCell>{user.name}</TableCell>
					<TableCell>{user.roleId}</TableCell>
					<TableHeaderCell>
						<Button size="xs">Login as</Button>
					</TableHeaderCell>
					</TableRow>
				))}
				</TableBody>
			</Table>
			</Card>
		</>
	  );
}