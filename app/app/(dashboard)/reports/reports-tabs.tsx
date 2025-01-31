import AllCharts from "@/components/overview-stats"
import { CustomerWithChargesAndSubscriptions } from "../customers/customer-table";

export default function ReportsTabs({customers} : {customers: CustomerWithChargesAndSubscriptions[] }) {	
	return (
		<AllCharts customers={customers} />
	)
}